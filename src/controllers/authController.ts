import { Request, RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token";
import { loginSchema, signupSchema } from "../validator/authSchema";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || "10");

export const signup: RequestHandler = async (req, res) => {
  try {
    const { email, name, password } = signupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "이미 존재하는 메일입니다." });
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
      .json({ message: "회원가입 완료", userId: newUser.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message:
          "이메일 또는 비밀번호가 틀렸습니다. -  user 없음(debugging용임.)",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀 번호가 틀렸습니다." });
    }

    const { accessToken, refreshToken } = generateToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //개발중일때는 false
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: "서버 오류", error });
  }
};
