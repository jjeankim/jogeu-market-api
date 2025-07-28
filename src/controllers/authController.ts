import { Request, RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types/expressUserRequest";

// salt 관련설정 env 해야함 이건 걍 갯수관련인듯
const SALT_ROUNDS = 10;

export const signup: RequestHandler = async (req, res) => {
  const { email, name, password, phoneNumber } = req.body;

  // zod?
  if (!email || !password || !name || !phoneNumber) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
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
        phoneNumber,
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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호를 입력해주세요." });
  }

  try {
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

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "3d",
      }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "서버 오류",error });
  }
};
