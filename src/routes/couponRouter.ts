import { Router } from "express";
import {
  createCoupon,
  findMyCoupon,
  findAllCoupons,
  useCoupon,
} from "../controllers/couponController";
import { authenticateJWT } from "../middleware/auth";

const CouponRouter = Router();
CouponRouter.post("/me/coupon", authenticateJWT, createCoupon)
  .get("/me/coupon", authenticateJWT, findMyCoupon)
  .get("/", findAllCoupons)
  .patch("/me/:id", authenticateJWT, useCoupon);

export default CouponRouter;
