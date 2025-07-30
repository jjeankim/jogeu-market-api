import { Response } from "express";
import { UserRequest } from "../types/expressUserRequest";
import prisma from "../lib/prisma";
import { COMMON_ERROR, ORDER_ERROR } from "../constants/errorMessage";
import { ORDER_SUCCESS } from "../constants/successMessage";

// 주문 생성
export const createOrder = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }

  const { shippingAddressId, paymentMethod, deliveryMessage } = req.body;
  try {
    // 유저의 장바구니 불러오기
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: ORDER_ERROR.EMPTY_CART });
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

    return res
      .status(201)
      .json({ message: ORDER_SUCCESS.CREATE, data: newOrder });
  } catch (error) {
    console.error("주문 생성 실패,", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
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
      include: {
        user: true,
        address: true,
        coupon: true,
        orderItems: true,
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
    console.log(order);
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
