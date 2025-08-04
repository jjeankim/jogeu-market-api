import { Router } from "express";
import {
  createCoupon,
  findMyCoupon,
  findAllCoupons,
  useCoupon,
} from "../controllers/couponController";
import { authenticateJWT } from "../middleware/auth";

const CouponRouter = Router();
CouponRouter.post("/me", authenticateJWT, createCoupon)
  .get("/me", authenticateJWT, findMyCoupon)
  .get("/", findAllCoupons)
  .patch("/me/:id", authenticateJWT, useCoupon);

export default CouponRouter;
