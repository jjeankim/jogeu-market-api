//  userController.ts

import { NextFunction, Response, RequestHandler } from "express";
import { UserRequest } from "../types/expressUserRequest";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { COMMON_ERROR, USER_ERROR } from "../constants/errorMessage";
import { USER_SUCCESS } from "../constants/successMessage";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || "10");

export const getMe: RequestHandler = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  // console.log(`req.user :${JSON.stringify(req.user)}`);
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      addresses: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: USER_ERROR.USER_NOT_FOUND });
  }

  res.status(200).json(user);
};

// 사용자 정보 업데이트
export const updateUserInfo = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }

  const { name, phoneNumber, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phoneNumber && { phoneNumber }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });

    return res.status(200).json({ 
      message: USER_SUCCESS.USER_UPDATED, 
      data: updatedUser 
    });
  } catch (error) {
    console.error("사용자 정보 업데이트 중 에러:", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 비밀번호 변경 (사용자 본인의 속성 변경)
export const updatePassword = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: USER_ERROR.PASSWORD_REQUIRED });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: USER_ERROR.SAME_AS_OLD_PASSWORD });
  }

  try {
    // 현재 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }, //보안을 위해 비밀번호만 선택적으로 가져옴
    });

    if (!user) {
      return res.status(404).json({ message: COMMON_ERROR.UNAUTHORIZED });
    }

    // 비밀번호가 설정되어 있지 않은(소셜 로그인만 한) 계정
    if (!user.password) {
      return res.status(409).json({ message: USER_ERROR.NO_PASSWORD_SET });
    }

    // 현재 비밀번호가 일치하는지 확인
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user?.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: USER_ERROR.PASSWORD_INCORRECT });
    }

    // 새 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // 변경이 성공적이라면 front에서 토스트로 해당 메세지를 띄워주면 될 것 같은 느낌적인 느낌?
    return res.status(200).json({ message: USER_SUCCESS.PASSWORD_UPDATED });
  } catch (error) {
    console.error("비밀번호 변경 중 에러:", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
