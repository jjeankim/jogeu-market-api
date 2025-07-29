import { Response } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";

// 위시리스트 상품 추가
export const createWish = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
  }
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "productId는 필수입니다." });
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
      return res
        .status(409)
        .json({ message: "이미 위시리스트에 추가된 상품입니다." });
    }
    // 위시리스트 상품 추가
    const newWishItem = await prisma.wishlist.create({
      data: {
        userId,
        productId: Number(productId),
      },
    });
    return res.status(201).json({
      message: "위시리스트에 상품이 성공적으로 추가됐습니다.",
      wishlist: newWishItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 위시리스트 조회
export const getWish = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
  }

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
    });

    return res.status(200).json({
      message: "위시리스트가 성공적으로 조회되었습니다.",
      wishlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 위시리스트 삭제
export const deleteWish = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
  }
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "유효하지 않은 상품입니다." });
  }

  try {
    const wish = await prisma.wishlist.findUnique({
      where: { id },
    });
    if (!wish || wish.userId !== userId) {
      return res
        .status(403)
        .json({ message: "삭제 권한이 없는 사용자입니다." });
    }
    const deletedWish = await prisma.wishlist.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "선택한 위시리스트 상품이 성공적으로 삭제되었습니다.",
      wishlist: deletedWish,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
