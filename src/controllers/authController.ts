import { Request, RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token";
import { loginSchema, signupSchema } from "../validator/authSchema";
import { AUTH_ERROR, COMMON_ERROR } from "../constants/errorMessage";
import { AUTH_SUCCESS } from "../constants/successMessage";
import { UserRequest } from "../types/expressUserRequest";
import jwt from "jsonwebtoken";

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

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return res
      .status(201)
      .json({ message: AUTH_SUCCESS.SIGNUP, userId: newUser.id });
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

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: AUTH_ERROR.INVALID_CREDENTIALS });
    }

    const { accessToken, refreshToken } = generateToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //개발중일때는 false
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path:"/"
    });

    return res.json({ 
      accessToken, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("로그인 중 에러 발생: ", error);

    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const refreshToken = async (req: UserRequest, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(204).send() //로그인 안한 상태임
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
    }

    const { accessToken, refreshToken } = generateToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: AUTH_ERROR.TOKEN_INVALID });
    }
    console.log("토큰 갱신 중 에러: ", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const logout = (req: Request, res:Response) =>{
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", 
  });

  return res.status(200).json({ message: "로그아웃 완료" });
}
