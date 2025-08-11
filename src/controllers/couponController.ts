import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";
import { COMMON_ERROR, COUPON_ERROR } from "../constants/errorMessage";
import { COUPON_SUCCESS } from "../constants/successMessage";

export const createCoupon = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  try {
    const { code } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code },
    });

    if (!coupon || !coupon.isActive || new Date() > coupon.validUntil) {
      return res.status(400).json({ error: COUPON_ERROR.INVALID_COUPON });
    }

    const already = await prisma.userCoupon.findFirst({
      where: { userId: userId, couponId: coupon.id },
    });

    if (already) {
      return res.status(400).json({ error: COUPON_ERROR.ALREADY_ISSUED });
    }

    const newUserCoupon = await prisma.userCoupon.create({
      data: {
        userId: userId,
        couponId: coupon.id,
        isUsed: false,
      },
    });

    console.log(newUserCoupon);

    return res.status(201).json({
      message: COUPON_SUCCESS.ISSUE,
      userCouponId: newUserCoupon.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const findMyCoupon = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  try {
    const userCoupon = await prisma.userCoupon.findMany({
      where: { userId , isUsed: false },
      include:{
        coupon: true
      }
    });
    console.log(userCoupon);

    return res.status(200).json({
      message: COUPON_SUCCESS.LIST,
      userCoupon,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const findAllCoupons = async (req: Request, res: Response) => {
  try {
    const findCoupons = await prisma.coupon.findMany();

    console.log(findCoupons);

    return res.status(200).json({
      message: COUPON_SUCCESS.LIST,
      coupon: findCoupons,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 쿠폰 사용 처리 로직 (다른 컨트롤러에서도 사용 가능)
export const processCouponUsage = async (userCouponId: number, userId: number, orderId: number) => {
  const userCoupon = await prisma.userCoupon.findUnique({
    where: { id: userCouponId },
    include: { coupon: true }
  });

  if (!userCoupon || userCoupon.userId !== userId) {
    throw new Error(COUPON_ERROR.NOT_FOUND_OR_NOT_OWNER);
  }

  if (userCoupon.isUsed) {
    throw new Error(COUPON_ERROR.ALREADY_USED);
  }

  // 쿠폰 유효성 검증
  if (!userCoupon.coupon.isActive || new Date() > userCoupon.coupon.validUntil) {
    throw new Error(COUPON_ERROR.INVALID_COUPON);
  }

  await prisma.userCoupon.update({
    where: { id: userCouponId },
    data: {
      isUsed: true,
      usedAt: new Date(),
      orderId: orderId,
    },
  });

  return userCoupon;
};

export const useCoupon = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  const couponId = parseInt(req.params.id);
  const { orderId } = req.body;

  try {
    await processCouponUsage(couponId, userId, orderId);
    return res.status(200).json({ message: COUPON_SUCCESS.USE });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
