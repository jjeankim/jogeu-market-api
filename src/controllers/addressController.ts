import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";
import { ADDRESS_ERROR, COMMON_ERROR } from "../constants/errorMessage";
import { ADDRESS_SUCCESS } from "../constants/successMessage";

// 배송지 등록
export const createAddress = async (req: UserRequest, res: Response) => {
  const {
    recipientName,
    recipientPhone,
    addressLine1,
    addressLine2,
    postCode,
  } = req.body;

  try {
    const address = await prisma.address.create({
      data: {
        userId: req.user!.id,
        recipientName: recipientName,
        recipientPhone: recipientPhone,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        postCode: postCode,
        isDefault: false,
      },
    });
    res.status(201).json({ message: ADDRESS_SUCCESS.CREATE, address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 배송지 수정
export const putAddress = async (req: UserRequest, res: Response) => {
  const addressId = Number(req.params.id);
  const userId = req.user!.id;

  const {
    recipientName,
    recipientPhone,
    addressLine1,
    addressLine2,
    postCode,
  } = req.body;

  try {
    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: ADDRESS_ERROR.NOT_FOUND });
    }

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: {
        recipientName,
        recipientPhone,
        addressLine1,
        addressLine2,
        postCode,
        isDefault: false,
      },
    });

    return res
      .status(200)
      .json({ message: ADDRESS_SUCCESS.UPDATE, data: updated });
  } catch (error) {
    console.error("배송지 수정 실패 : ", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 기본 배송지 등록
export const patchAddress = async (req: UserRequest, res: Response) => {
  const addressId = Number(req.params.id);
  const userId = req.user!.id;

  try {
    const target = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!target || target.userId !== userId) {
      return res.status(404).json({ message: ADDRESS_ERROR.NOT_FOUND });
    }

    await prisma.address.updateMany({
      where: {
        userId: userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    const updateAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        isDefault: true,
      },
    });

    return res.status(200).json({
      message: ADDRESS_SUCCESS.SET_DEFAULT,
      data: updateAddress,
    });
  } catch (error) {
    console.error("기본 배송지 변경 에러 :", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 등록한 전체 배송지 가져오기
export const getAllAddress = async (req: UserRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const findAllAddress = await prisma.address.findMany({
      where: { userId: userId },
    });

    return res.status(200).json({
      message: ADDRESS_SUCCESS.GET_ALL,
      data: findAllAddress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
