import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";

export const createCoupon = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
  }
  try {
    const { couponCode } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    if (!coupon || !coupon.isActive || new Date() > coupon.validUntil) {
      return res.status(400).json({ error: "유효하지 않은 쿠폰입니다" });
    }

    const already = await prisma.userCoupon.findFirst({
      where: { userId: userId, couponId: coupon.id },
    });

    if (already) {
      return res.status(400).json({ error: "이미 발급받은 쿠폰입니다" });
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
      message: "✅ 쿠폰이 성공적으로 발급되었습니다",
      userCouponId: newUserCoupon.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const findMyCoupon = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
  }
  try {
    const userCoupon = await prisma.userCoupon.findMany({
      where: { userId },
    });
    console.log(userCoupon);

    return res.status(200).json({
      message: "✅ 쿠폰이 성공적으로 조회되었습니다",
      userCoupon,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const findAllCoupons = async (req: Request, res: Response) => {
  try {
    const findCoupons = await prisma.coupon.findMany();

    console.log(findCoupons);

    return res.status(200).json({
      message: "✅ 쿠폰 목록입니다.",
      coupon: findCoupons,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const useCoupon = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
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
        .json({ error: "쿠폰이 존재하지 않거나 소유자가 아닙니다" });
    }

    if (userCoupon.isUsed) {
      return res.status(400).json({ error: "이미 사용된 쿠폰입니다" });
    }

    await prisma.userCoupon.update({
      where: { id: couponId },
      data: {
        isUsed: true,
        usedAt: new Date(),
        orderId: orderId || null,
      },
    });

    return res
      .status(200)
      .json({ message: "✅쿠폰을 성공적으로 사용하였습니다" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
