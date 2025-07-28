import { RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import { getPagination } from "../utils/pagination";
import { UserRequest } from "../types/expressUserRequest";

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
      message: "샘플 목록 조회 성공",
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
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export const createSampleOrder = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
  }

  const { shippingAddressId, paymentMethod, deliveryMessage } = req.body;

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
        .json({ message: "샘플 장바구니가 비어 있습니다." });
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
      .status(200)
      .json({ message: "샘플 주문 생성 완료", data: newOrder });
  } catch (error) {
    console.error("샘플 주문 생성 실패", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};
