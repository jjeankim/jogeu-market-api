"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCoupon = exports.processCouponUsage = exports.findAllCoupons = exports.findMyCoupon = exports.createCoupon = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorMessage_1 = require("../constants/errorMessage");
const successMessage_1 = require("../constants/successMessage");
const createCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    try {
        const { code } = req.body;
        const coupon = yield prisma_1.default.coupon.findUnique({
            where: { code: code },
        });
        if (!coupon || !coupon.isActive || new Date() > coupon.validUntil) {
            return res.status(400).json({ error: errorMessage_1.COUPON_ERROR.INVALID_COUPON });
        }
        const already = yield prisma_1.default.userCoupon.findFirst({
            where: { userId: userId, couponId: coupon.id },
        });
        if (already) {
            return res.status(400).json({ error: errorMessage_1.COUPON_ERROR.ALREADY_ISSUED });
        }
        const newUserCoupon = yield prisma_1.default.userCoupon.create({
            data: {
                userId: userId,
                couponId: coupon.id,
                isUsed: false,
            },
        });
        console.log(newUserCoupon);
        return res.status(201).json({
            message: successMessage_1.COUPON_SUCCESS.ISSUE,
            userCouponId: newUserCoupon.id,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.createCoupon = createCoupon;
const findMyCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    try {
        const userCoupon = yield prisma_1.default.userCoupon.findMany({
            where: { userId, isUsed: false },
            include: {
                coupon: true
            }
        });
        console.log(userCoupon);
        return res.status(200).json({
            message: successMessage_1.COUPON_SUCCESS.LIST,
            userCoupon,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.findMyCoupon = findMyCoupon;
const findAllCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findCoupons = yield prisma_1.default.coupon.findMany();
        console.log(findCoupons);
        return res.status(200).json({
            message: successMessage_1.COUPON_SUCCESS.LIST,
            coupon: findCoupons,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.findAllCoupons = findAllCoupons;
// 쿠폰 사용 처리 로직 (다른 컨트롤러에서도 사용 가능)
const processCouponUsage = (userCouponId, userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const userCoupon = yield prisma_1.default.userCoupon.findUnique({
        where: { id: userCouponId },
        include: { coupon: true }
    });
    if (!userCoupon || userCoupon.userId !== userId) {
        throw new Error(errorMessage_1.COUPON_ERROR.NOT_FOUND_OR_NOT_OWNER);
    }
    if (userCoupon.isUsed) {
        throw new Error(errorMessage_1.COUPON_ERROR.ALREADY_USED);
    }
    // 쿠폰 유효성 검증
    if (!userCoupon.coupon.isActive || new Date() > userCoupon.coupon.validUntil) {
        throw new Error(errorMessage_1.COUPON_ERROR.INVALID_COUPON);
    }
    yield prisma_1.default.userCoupon.update({
        where: { id: userCouponId },
        data: {
            isUsed: true,
            usedAt: new Date(),
            orderId: orderId,
        },
    });
    return userCoupon;
});
exports.processCouponUsage = processCouponUsage;
const useCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const couponId = parseInt(req.params.id);
    const { orderId } = req.body;
    try {
        yield (0, exports.processCouponUsage)(couponId, userId, orderId);
        return res.status(200).json({ message: successMessage_1.COUPON_SUCCESS.USE });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.useCoupon = useCoupon;
