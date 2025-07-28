import { Response } from "express";
import { UserRequest } from "../types/expressUserRequest";
import prisma from "../lib/prisma";

// 주문 생성
export const createOrder = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자 입니다." });
  }

  const { shippingAddressId, paymentMethod, deliveryMessage } = req.body;
  try {
    // 유저의 장바구니 불러오기
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });
    console.log("장바구니 아이템,", cartItems);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "장바구니가 비어 있습니다." });
    }

    // 총액 계산
    const itemsTotal = cartItems.reduce((sum, item) => {
      return sum + item.quantity * Number(item.product.price);
    }, 0);

    const shippingFee = 3000; // 고정 배송비
    const totalAmount = itemsTotal + shippingFee;

    // 주문 생성
    const newOrder = await prisma.order.create({
      data: {
        userId,
        shippingAddressId,

        paymentMethod,
        paymentStatus: "결제대기",
        deliveryMessage,
        totalAmount,
        shippingFee,
        orderNumber: `ORD-${Date.now()}`, // timestamp 기반 주문번호
        orderItems: {
          create: cartItems.map((item) => ({
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
    await prisma.cart.deleteMany({ where: { userId } });

    return res.status(201).json({ message: "주문 생성 완료,", data: newOrder });
  } catch (error) {
    console.error("주문 생성 실패,", error);
    return res.status(500).json({ message: "서버 오류 발생" });

  }
};

// 주문 목록 전체 조회
export const getAllOrders = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자 입니다." });
  }
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        address: true,
        coupon: true,
        orderItems: true,
      },
    });
    if (!orders) {
      return res.status(404).json({ message: "주문 목록을 찾을 수 없습니다." });
    }
    console.log(orders);
    res
      .status(200)
      .json({ message: "주문 목록 조회에 성공했습니다.", data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "서버 오류로 주문 목록 조회에 실패했습니다." });

  }
};

// 주문 상세 조회
export const getOrder = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자 입니다." });
  }
  const id = Number(req.params.id);
  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      return res.status(404).json({ message: "주문을 찾을 수 없습니다." });
    }
    console.log(order);
    return res
      .status(200)
      .json({ message: "주문 상세 조회 성공", data: order });
  } catch (error) {
    console.error("주문 상세 조회 실패,", error);
  }
};

// 결제 상태 변경
export const updateOrderStatus = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자 입니다." });
  }
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "유효한 주문 ID가 필요합니다." });
  }
  const { paymentStatus } = req.body;

  const validStatus = ["결제대기", "결제완료", "결제실패"];
  if (!paymentStatus || !validStatus.includes(paymentStatus)) {
    return res
      .status(400)
      .json({ error: "유효한 paymentStatus값이 필요합니다." });
  }

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
    });
    res.status(200).json({
      message: "주문상태가 성공적으로 변경되었습니다.",
      data: updated,
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as { code: string }).code === "P2025") {
        return res.status(404).json({ error: "해당 주문을 찾을 수 없습니다." });
      }
    }
    console.error("주문 상태 변경 오류: ", error);
    return res.status(500).json({ error: "주문상태 변경에 실패했습니다." });
  }
};
