import { Request, RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { loginSchema, signupSchema } from "../validator/authSchema";
import { AUTH_ERROR, COMMON_ERROR } from "../constants/errorMessage";
import { AUTH_SUCCESS } from "../constants/successMessage";
import { UserRequest } from "../types/expressUserRequest";
import jwt from "jsonwebtoken";
import { JwtPayLoad, RefreshTokenPayload } from "../types/userType";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || "10");

export const signup: RequestHandler = async (req, res) => {
  try {
    const { email, name, password } = signupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: AUTH_ERROR.EMAIL_ALREADY_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const welcomeCoupon = await tx.coupon.findFirst({
        where: {
          code: "FirstSignUp",
          isActive: true,
          validUntil: {
            gte: new Date(),
          },
        },
      });

      if (welcomeCoupon) {
        await tx.userCoupon.create({
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
    });
    return res.status(201).json({
      message: AUTH_SUCCESS.SIGNUP,
      userId: result.newUser.id,
      welcomeCouponIssued: result.welcomeCouponIssued,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: AUTH_ERROR.INVALID_CREDENTIALS,
      });
    }

    //소셜 로그인 사용자의 경우 password가 null일 수 있음
    if (!user.password) {
      return res.status(401).json({ message: AUTH_ERROR.INVALID_CREDENTIALS });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: AUTH_ERROR.INVALID_CREDENTIALS });
    }

    // 🔑 JwtPayload 매핑
    const payload: JwtPayLoad = {
      id: user.id,
      name: user.name,
      provider: user.provider ?? "local", // 자체 로그인은 local
      providerId: user.providerId ?? user.id.toString(),
      ...(user.email ? { email: user.email } : {}),
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({
      id: payload.id,
      provider: payload.provider,
      providerId: payload.providerId,
    });

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
  } catch (error) {
    console.error("로그인 중 에러 발생: ", error);

    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const refreshToken = async (req: UserRequest, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(204).send(); //로그인 안한 상태임
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as RefreshTokenPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
    }

    // JwtPayload 재구성
    const payload: JwtPayLoad = {
      id: user.id,
      name: user.name ?? undefined,
      provider: decoded.provider,
      providerId: decoded.providerId,
      ...(user.email ? { email: user.email } : {}),
    };

    const accessToken = generateAccessToken(payload);

    res.json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: AUTH_ERROR.TOKEN_INVALID });
    }
    console.log("토큰 갱신 중 에러: ", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({ message: "로그아웃 완료" });
};
