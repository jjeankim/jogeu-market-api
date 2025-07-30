import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";
import { COMMON_ERROR } from "../constants/errorMessage";
import { CART_SUCCESS } from "../constants/successMessage";

export const createCart = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
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
      message: CART_SUCCESS.ADD,
      carts: newCartItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const getCart = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  try {
    const findCart = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    console.log(findCart);

    return res.status(200).json({
      message: CART_SUCCESS.ADD,
      carts: findCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const patchCart = async (req: UserRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    const patchCart = await prisma.cart.update({
      where: { id },
      data: { quantity },
    });

    console.log(patchCart);

    return res.status(200).json({
      message: CART_SUCCESS.UPDATE,
      products: patchCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
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
      message: CART_SUCCESS.DELETE,
      products: deleteCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
