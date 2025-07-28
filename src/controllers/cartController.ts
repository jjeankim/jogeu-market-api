import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";

export const createCart = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
  }
  try {
    const { productId, quantity } = req.body;

    const newCartItem = await prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });

    console.log(newCartItem);

    return res.status(201).json({
      message: "✅ 카트에 제품이 성공적으로 담겼습니다.",
      carts: newCartItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const findCart = await prisma.product.findMany();

    console.log(findCart);

    return res.status(200).json({
      message: "✅ 상품이 성공적으로 조회되었습니다.",
      products: findCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const patchCart = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    const patchCart = await prisma.cart.update({
      where: { id },
      data: { quantity },
    });

    console.log(patchCart);

    return res.status(200).json({
      message: "✅ 상품이 성공적으로 수정되었습니다.",
      products: patchCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const deleteCart = await prisma.cart.delete({
      where: { id },
    });

    console.log(deleteCart);

    return res.status(200).json({
      message: "✅ 상품이 성공적으로 삭제되었습니다.",
      products: deleteCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
