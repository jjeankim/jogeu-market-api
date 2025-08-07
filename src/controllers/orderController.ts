import { Response } from "express";
import { UserRequest } from "../types/expressUserRequest";
import prisma from "../lib/prisma";
import { COMMON_ERROR, ORDER_ERROR } from "../constants/errorMessage";
import { ORDER_SUCCESS } from "../constants/successMessage";
import { processCouponUsage } from "./couponController";

// 주문 생성
export const createOrder = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }

  console.log('주문 생성 요청 데이터:', req.body);

  const { 
    items, 
    totalAmount, 
    shippingAddress, 
    recipientName, 
    recipientPhone, 
    ordererName, 
    ordererPhone, 
    ordererEmail, 
    userCouponId, // couponId 대신 userCouponId 사용
    discountAmount,
    paymentMethod = "토스페이먼츠",
    deliveryMessage = ""
  } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: ORDER_ERROR.EMPTY_CART });
    }

    // 트랜잭션으로 주문 생성과 쿠폰 사용을 원자적으로 처리
    const result = await prisma.$transaction(async (tx) => {
      // 주소 생성 (또는 기존 주소 찾기)
      let addressId: number;
      const existingAddress = await tx.address.findFirst({
        where: {
          userId: userId,
          recipientName: recipientName,
          recipientPhone: recipientPhone,
        }
      });

      if (existingAddress) {
        addressId = existingAddress.id;
      } else {
        const newAddress = await tx.address.create({
          data: {
            userId,
            recipientName,
            recipientPhone,
            addressLine1: shippingAddress.roadAddress,
            addressLine2: shippingAddress.detailAddress,
            postCode: shippingAddress.zipCode,
            isDefault: false,
          }
        });
        addressId = newAddress.id;
      }

      // 주문 생성
      const newOrder = await tx.order.create({
        data: {
          userId,
          shippingAddressId: addressId,
          paymentMethod,
          paymentStatus: "결제완료",
          deliveryMessage,
          totalAmount,
          shippingFee: 3000, // 고정 배송비
          orderNumber: `ORD-${Date.now()}`, // timestamp 기반 주문번호
          orderItems: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  brand: true,
                },
              },
            },
          },
        },
      });

      // 쿠폰 사용 처리
      if (userCouponId) {
        const userCoupon = await tx.userCoupon.findUnique({
          where: { id: userCouponId },
          include: { coupon: true }
        });

        if (!userCoupon || userCoupon.userId !== userId) {
          throw new Error("쿠폰을 찾을 수 없거나 권한이 없습니다.");
        }

        if (userCoupon.isUsed) {
          throw new Error("이미 사용된 쿠폰입니다.");
        }

        // 쿠폰 유효성 검증
        if (!userCoupon.coupon.isActive || new Date() > userCoupon.coupon.validUntil) {
          throw new Error("유효하지 않은 쿠폰입니다.");
        }

        // 쿠폰 사용 처리
        await tx.userCoupon.update({
          where: { id: userCouponId },
          data: {
            isUsed: true,
            usedAt: new Date(),
            orderId: newOrder.id,
          },
        });

        // 주문에 쿠폰 정보 업데이트
        await tx.order.update({
          where: { id: newOrder.id },
          data: { couponId: userCoupon.couponId },
        });
      }

      // 주문된 상품들을 장바구니에서 제거
      const cartItemIds = items.map((item: any) => item.cartItemId).filter(Boolean);
      if (cartItemIds.length > 0) {
        await tx.cart.deleteMany({
          where: {
            id: { in: cartItemIds },
            userId: userId
          }
        });
      }

      return newOrder;
    });

    return res
      .status(201)
      .json({ message: ORDER_SUCCESS.CREATE, data: result });
  } catch (error) {
    console.error("주문 생성 실패,", error);
    console.error("요청 데이터:", req.body);
    return res.status(500).json({ 
      message: COMMON_ERROR.SERVER_ERROR,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 주문 목록 전체 조회
export const getAllOrders = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  try {
    const orders = await prisma.order.findMany({
      where: { userId }, // 로그인 유저 ID로 필터링
      include: {
        user: true,
        address: true,
        coupon: true,
        // 브랜드 이름 추가
        orderItems: {
          include: {
            product: {
              include: {
                brand: true,
              },
            },
            review: true
          },
        },
      },
    });
    if (!orders) {
      return res.status(404).json({ message: ORDER_ERROR.LIST_NOT_FOUND });
    }
    console.log(orders);
    res.status(200).json({ message: ORDER_SUCCESS.LIST, data: orders });
  } catch (error) {
    res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 주문 상세 조회
export const getOrder = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  const id = Number(req.params.id);
  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      return res.status(404).json({ message: ORDER_ERROR.DETAIL_NOT_FOUND });
    }

    // 권한 체크: 주문 userId와 요청 userId 비교
    if (order.userId !== userId) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    return res.status(200).json({ message: ORDER_SUCCESS.DETAIL, data: order });
  } catch (error) {
    console.error("주문 상세 조회 실패,", error);
    res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 결제 상태 변경
export const updateOrderStatus = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: ORDER_ERROR.INVALID_ID });
  }
  const { paymentStatus } = req.body;

  const validStatus = ["결제대기", "결제완료", "결제실패"];
  if (!paymentStatus || !validStatus.includes(paymentStatus)) {
    return res.status(400).json({ error: ORDER_ERROR.INVALID_PAYMENT_STATUS });
  }

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
    });
    res.status(200).json({
      message: ORDER_SUCCESS.STATUS_UPDATE,
      data: updated,
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as { code: string }).code === "P2025") {
        return res.status(404).json({ error: ORDER_ERROR.ORDER_NOT_FOUND });
      }
    }
    console.error("주문 상태 변경 에러: ", error);
    return res.status(500).json({ message: ORDER_ERROR.STATUS_UPDATE_FAILED });
  }
};
