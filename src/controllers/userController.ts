//  userController.ts

import { NextFunction, Response, RequestHandler } from "express";
import { UserRequest } from "../types/expressUserRequest";
import prisma from "../lib/prisma";

export const getMe: RequestHandler = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  // console.log(`req.user :${JSON.stringify(req.user)}`);
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "인증 정보가 없습니다." });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  }

  res.status(200).json({ id: user.id, email: user.email });
};

export const createAddress: RequestHandler = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "인증 정보가 없습니다." });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  }
};
