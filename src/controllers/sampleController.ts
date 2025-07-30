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

  // try {
  //   const result = await prisma.$transaction(async (tx) => {
  //     // 샘플 상품만 담긴 장바구기 불러오기
  //     const sapmleCartItems = await tx.cart.findMany({
  //       where: {
  //         userId,
  //         product: {
  //           isSample: true,
  //         },
  //       },
  //       include: {
  //         product: true,
  //       },
  //     });

  //     if (sapmleCartItems.length === 0) {
  //       return res
  //         .status(400)
  //         .json({ message: "샘플 장바구니가 비어 있습니다." });
  //     }

  //     const itemsTotal = sapmleCartItems.reduce((sum, item) => {
  //       return sum + item.quantity * Number(item.product.price);
  //     }, 0);

  //     const shippingFee = 3000;
  //     const totalAmount = itemsTotal + shippingFee;

  //     // 주문 생성
  //     const newOrder = await tx.order.create({
  //       data: {
  //         userId,
  //         shippingAddressId,
  //         paymentMethod,
  //         paymentStatus: "결제대기",
  //         deliveryMessage,
  //         totalAmount,
  //         shippingFee,
  //         isSample: true,
  //         orderNumber: `SMP-${Date.now()}-${userId}`,
  //         orderItems: {
  //           create: sapmleCartItems.map((item) => ({
  //             productId: item.productId,
  //             quantity: item.quantity,
  //             priceAtPurchase: item.product.price,
  //           })),
  //         },
  //       },
  //       include: {
  //         orderItems: true,
  //       },
  //     });

  //     // 장바구기 비우기 (일단 비우지만, 결제 실패 시 롤백됨)
  //     await tx.cart.deleteMany({
  //       where: {
  //         userId,
  //         product: {
  //           isSample: true,
  //         },
  //       },
  //     });

  //     // 결제 처리 시뮬레이션
  //     const paymentsSuccess = true;

  //     if (!paymentsSuccess) {
  //       throw new Error("결제에 실패했습니다. 주문이 취소됩니다.");
  //     }

  //     // 결제 성공 시 DB 상태 업데이트 및 쿠폰 발급
  //     const updateOrder = await tx.order.update({
  //       where: {
  //         id: newOrder.id,
  //       },
  //       data: {
  //         paymentStatus: "결제 완료",
  //       },
  //     });

  //     // 샘플 구매 쿠폰 발급 (함수)

  //     return {order: updateOrder, coupon: isSampleCoupon}
  //   });
  // } catch (error) {}

  // 샘플 상품만 담긴 장바구니 불러오기
  try {
    const sapmleCartItems = await prisma.cart.findMany({
      where: {
        userId,
        product: {
          isSample: true, // 샘플만
        },
      },
      include: {
        product: true,
      },
    });

    if (sapmleCartItems.length === 0) {
      return res
        .status(400)
        .json({ message: SAMPLE_ORDER_ERROR.EMPTY_SAMPLE_CART });
    }

    const itemsTotal = sapmleCartItems.reduce((sum, item) => {
      return sum + item.quantity * Number(item.product.price);
    }, 0);

    const shippingFee = 3000;
    const totalAmount = itemsTotal + shippingFee;

    const newOrder = await prisma.order.create({
      data: {
        userId,
        shippingAddressId,
        paymentMethod,
        paymentStatus: "결제대기",
        deliveryMessage,
        totalAmount,
        shippingFee,
        isSample: true,
        orderNumber: `SMP-${Date.now()}`,
        orderItems: {
          create: sapmleCartItems.map((item) => ({
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
    // 장바구니 비우기
    await prisma.cart.deleteMany({
      where: {
        userId,
        product: {
          isSample: true,
        },
      },
    });
    return res
      .status(201)
      .json({ message: SAMPLE_ORDER_SUCCESS.ORDER_CREATE, data: newOrder });
  } catch (error) {
    console.error("샘플 주문 생성 실패", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// // 샘플 구매 시 자동 쿠폰 발급
// export const isSampleCoupon = async (req: UserRequest, res: Response) => {
//   const userId = req.user?.id;
//   if (!userId) {
//     return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
//   }
// };
