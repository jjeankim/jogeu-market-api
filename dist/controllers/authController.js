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
exports.logout = exports.refreshToken = exports.login = exports.signup = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = require("../utils/token");
const authSchema_1 = require("../validator/authSchema");
const errorMessage_1 = require("../constants/errorMessage");
const successMessage_1 = require("../constants/successMessage");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || "10");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = authSchema_1.signupSchema.parse(req.body);
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({ message: errorMessage_1.AUTH_ERROR.EMAIL_ALREADY_EXISTS });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = yield prisma_1.default.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
            const welcomeCoupon = yield tx.coupon.findFirst({
                where: {
                    code: "FirstSignUp",
                    isActive: true,
                    validUntil: {
                        gte: new Date(),
                    },
                },
            });
            if (welcomeCoupon) {
                yield tx.userCoupon.create({
                    data: {
                        userId: newUser.id,
                        couponId: welcomeCoupon.id,
                        isUsed: false,
                    },
                });
            }
            return {
                newUser,
                welcomeCouponIssued: !!welcomeCoupon,
            };
        }));
        return res
            .status(201)
            .json({
            message: successMessage_1.AUTH_SUCCESS.SIGNUP,
            userId: result.newUser.id,
            welcomeCouponIssued: result.welcomeCouponIssued,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = authSchema_1.loginSchema.parse(req.body);
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: errorMessage_1.AUTH_ERROR.INVALID_CREDENTIALS,
            });
        }
        //소셜 로그인 사용자의 경우 password가 null일 수 있음
        if (!user.password) {
            return res.status(401).json({ message: errorMessage_1.AUTH_ERROR.INVALID_CREDENTIALS });
        }
        const isValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: errorMessage_1.AUTH_ERROR.INVALID_CREDENTIALS });
        }
        const accessToken = (0, token_1.generateAccessToken)(user);
        const refreshToken = (0, token_1.generateRefreshToken)(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", //개발중일때는 false
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        return res.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (error) {
        console.error("로그인 중 에러 발생: ", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(204).send(); //로그인 안한 상태임
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield prisma_1.default.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
        }
        const accessToken = (0, token_1.generateAccessToken)(user);
        res.json({ accessToken });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: errorMessage_1.AUTH_ERROR.TOKEN_INVALID });
        }
        console.log("토큰 갱신 중 에러: ", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
    return res.status(200).json({ message: "로그아웃 완료" });
};
exports.logout = logout;
