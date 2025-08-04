import { RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import { getPagination } from "../utils/pagination";
import { UserRequest } from "../types/expressUserRequest";
import { SAMPLE_ORDER_SUCCESS } from "../constants/successMessage";
import { COMMON_ERROR, SAMPLE_ORDER_ERROR } from "../constants/errorMessage";

export const getSampleList: RequestHandler = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  try {
    const [sampleList, total] = await Promise.all([
      prisma.product.findMany({
        where: { isSample: true },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.product.count({
        where: { isSample: true },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    return res.status(200).json({
      message: SAMPLE_ORDER_SUCCESS.SAMPLE_LIST,
      data: sampleList,
      pagination: {
        total,
        page,
        totalPages,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    console.error("샘플 상품 목록 가져오기 실패", error);
    res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const createSampleOrder = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.SERVER_ERROR });
  }

  const { shippingAddressId, paymentMethod, deliveryMessage } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const sampleCartItems = await tx.cart.findMany({
        where: {
          userId,
          product: {
            isSample: true,
          },
        },
        include: {
          product: true,
        },
      });

      if (sampleCartItems.length === 0) {
        throw new Error(SAMPLE_ORDER_ERROR.EMPTY_SAMPLE_CART);
      }

      for (const cartItem of sampleCartItems) {
        if (cartItem.quantity > cartItem.product.stockQuantity) {
          throw new Error(`상품 ${cartItem.product.name}의 재고가 부족합니다.`);
        }
      }

      const itemsTotal = sampleCartItems.reduce((sum, item) => {
        return sum + item.quantity * Number(item.product.price);
      }, 0);

      const shippingFee = 3000;
      const totalAmount = itemsTotal + shippingFee;

      const newOrder = await tx.order.create({
        data: {
          userId,
          shippingAddressId,
          paymentMethod,
          paymentStatus: "결제대기",
          deliveryMessage,
          totalAmount,
          shippingFee,
          isSample: true,
          orderNumber: `SMP-${Date.now()}-${userId}`,
          orderItems: {
            create: sampleCartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      for (const cartItem of sampleCartItems) {
        await tx.product.update({
          where: { id: cartItem.productId },
          data: {
            stockQuantity: {
              decrement: cartItem.quantity,
            },
          },
        });
      }

      const paymentSuccess = await simulatePayment(totalAmount);

      if (!paymentSuccess) {
        throw new Error("결제에 실패했습니다. 주문이 취소됩니다.");
      }

      const updatedOrder = await tx.order.update({
        where: { id: newOrder.id },
        data: { paymentStatus: "결제 완료" },
        include: {
          orderItems: true,
        },
      });

      await tx.cart.deleteMany({
        where: {
          userId,
          product: {
            isSample: true,
          },
        },
      });

      const issuedCoupon = await issueSamplePurchaseCoupon(tx, userId);

      return {
        order: updatedOrder,
        coupon: issuedCoupon,
      };
    });

    return res.status(201).json({
      message: SAMPLE_ORDER_SUCCESS.ORDER_CREATE,
      data: {
        order: result.order,
        coupon: result.coupon,
      },
    });
  } catch (error) {
    console.error("샘플 주문 생성 실패", error);

    // 에러 메시지
    if (error instanceof Error) {
      if (error.message === SAMPLE_ORDER_ERROR.EMPTY_SAMPLE_CART) {
        return res.status(400).json({
          error: SAMPLE_ORDER_ERROR.EMPTY_SAMPLE_CART,
        });
      }
      if (error.message.includes("재고가 부족합니다")) {
        return res.status(400).json({
          error: "상품 재고가 부족합니다.",
        });
      }
      if (error.message.includes("결제에 실패")) {
        return res.status(400).json({
          error: "결제에 실패했습니다.",
        });
      }
      if (error.message.includes("쿠폰 발급에 실패")) {
        return res.status(400).json({
          error: "쿠폰 발급에 실패했습니다.",
        });
      }
      if (error.message.includes("유효하지 않은 쿠폰")) {
        return res.status(400).json({
          error: "유효하지 않은 쿠폰입니다.",
        });
      }
    }

    return res.status(500).json({ error: COMMON_ERROR.SERVER_ERROR });
  }
};

// 결제 시뮬레이션 함수
const simulatePayment = async (amount: number): Promise<boolean> => {
  // 실제 구현에서는 외부 결제 API를 호출
  // 여기서는 90% 확률로 성공하는 시뮬레이션
  return Math.random() > 0.1;
};

const issueSamplePurchaseCoupon = async (tx: any, userId: number) => {
  try {
    const existingUserCoupon = await tx.userCoupon.findFirst({
      where: {
        userId,
        coupon: {
          issuedBySamplePurchase: true,
        },
      },
      include: {
        coupon: true,
      },
    });

    if (existingUserCoupon) {
      return existingUserCoupon;
    }

    const sampleCoupon = await tx.coupon.create({
      data: {
        code: `SAMPLE-${Date.now()}-${userId}`,
        name: "샘플 구매 감사 쿠폰",
        discountType: "percentage",
        discountValue: 10, // 10% 할인
        minOrderAmount: 50000, // 5만원 이상 구매 시
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 유효
        isActive: true,
        usageLimit: 1,
        issuedBySamplePurchase: true,
      },
    });

    if (!sampleCoupon.isActive || new Date() > sampleCoupon.validUntil) {
      throw new Error("유효하지 않은 쿠폰입니다.");
    }

    const userCoupon = await tx.userCoupon.create({
      data: {
        userId,
        couponId: sampleCoupon.id,
        isUsed: false,
      },
      include: {
        coupon: true,
      },
    });

    console.log(
      `샘플 구매 쿠폰 발급 완료: User ${userId}, Coupon ${sampleCoupon.id}`
    );

    return userCoupon;
  } catch (error) {
    console.error("쿠폰 발급 실패", error);
    throw new Error("쿠폰 발급에 실패했습니다.");
  }
};
