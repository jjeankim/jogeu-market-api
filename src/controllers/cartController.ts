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

    // 기존에 같은 상품이 장바구니에 있는지 확인하고 처리
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      // 기존 아이템이 있으면 수량을 더함
      cartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      console.log("기존 장바구니 아이템 수량 업데이트:", cartItem);
    } else {
      // 기존 아이템이 없으면 새로 생성
      cartItem = await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
      console.log("새 장바구니 아이템 생성:", cartItem);
    }

    return res.status(201).json({
      message: CART_SUCCESS.ADD,
      carts: cartItem,
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

// 중복된 장바구니 아이템들을 정리하는 함수
export const mergeDuplicateCartItems = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }

  try {
    // 사용자의 모든 장바구니 아이템을 productId별로 그룹화
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      orderBy: { id: 'asc' }, // 가장 오래된 것을 기준으로
    });

    // productId별로 그룹화
    const groupedItems = cartItems.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = [];
      }
      acc[item.productId].push(item);
      return acc;
    }, {} as Record<number, typeof cartItems>);

    let mergedCount = 0;

    // 각 productId별로 중복 제거
    for (const [productId, items] of Object.entries(groupedItems)) {
      if (items.length > 1) {
        // 총 수량 계산
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        
        // 첫 번째 아이템 유지하고 수량 업데이트
        const keepItem = items[0];
        await prisma.cart.update({
          where: { id: keepItem.id },
          data: { quantity: totalQuantity },
        });

        // 나머지 아이템들 삭제
        const idsToDelete = items.slice(1).map(item => item.id);
        await prisma.cart.deleteMany({
          where: { id: { in: idsToDelete } },
        });

        mergedCount += items.length - 1;
        console.log(`상품 ${productId}: ${items.length}개 아이템을 1개로 통합 (총 수량: ${totalQuantity})`);
      }
    }

    return res.status(200).json({
      message: `중복된 장바구니 아이템 ${mergedCount}개를 정리했습니다.`,
      mergedCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
