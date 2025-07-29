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
    const { couponCode } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
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
      where: { userId },
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

export const useCoupon = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }
  const couponId = parseInt(req.params.id);
  const { orderId } = req.body;

  try {
    const userCoupon = await prisma.userCoupon.findUnique({
      where: { id: couponId },
    });

    if (!userCoupon || userCoupon.userId !== userId) {
      return res
        .status(404)
        .json({ error: COUPON_ERROR.NOT_FOUND_OR_NOT_OWNER });
    }

    if (userCoupon.isUsed) {
      return res.status(400).json({ error: COUPON_ERROR.ALREADY_USED });
    }

    await prisma.userCoupon.update({
      where: { id: couponId },
      data: {
        isUsed: true,
        usedAt: new Date(),
        orderId: orderId || null,
      },
    });

    return res.status(200).json({ message: COUPON_SUCCESS.USE });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
