import { Response } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";
import { COMMON_ERROR, WISHLIST_ERROR } from "../constants/errorMessage";
import { WISHLIST_SUCCESS } from "../constants/successMessage";

// 위시리스트 상품 추가
export const createWish = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  const { productId } = req.body;
  if (!productId) {
    return res
      .status(400)
      .json({ message: WISHLIST_ERROR.PRODUCT_ID_REQUIRED });
  }

  try {
    // 위시리스트 상품 중복체크
    const existWish = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: Number(productId),
        },
      },
    });
    if (existWish) {
      return res.status(409).json({ message: WISHLIST_ERROR.ALREADY_EXISTS });
    }
    // 위시리스트 상품 추가
    const newWishItem = await prisma.wishlist.create({
      data: {
        userId,
        productId: Number(productId),
      },
    });
    return res.status(201).json({
      message: WISHLIST_SUCCESS.ADD,
      wishlist: newWishItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 위시리스트 조회
export const getWish = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
    });

    return res.status(200).json({
      message: WISHLIST_SUCCESS.FETCH,
      wishlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 위시리스트 삭제
export const deleteWish = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: WISHLIST_ERROR.INVALID_PRODUCT });
  }

  try {
    const wish = await prisma.wishlist.findUnique({
      where: { id },
    });
    if (!wish || wish.userId !== userId) {
      return res.status(403).json({ message: COMMON_ERROR.UNAUTHORIZED });
    }
    const deletedWish = await prisma.wishlist.delete({
      where: { id },
    });

    return res.status(200).json({
      message: WISHLIST_SUCCESS.DELETE,
      wishlist: deletedWish,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
