"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const couponController_1 = require("../controllers/couponController");
const auth_1 = require("../middleware/auth");
const couponRouter = (0, express_1.Router)();
couponRouter
    .post("/me", auth_1.authenticateJWT, couponController_1.createCoupon)
    .get("/me", auth_1.authenticateJWT, couponController_1.findMyCoupon)
    .get("/", couponController_1.findAllCoupons)
    .patch("/me/:id", auth_1.authenticateJWT, couponController_1.useCoupon);
exports.default = couponRouter;
