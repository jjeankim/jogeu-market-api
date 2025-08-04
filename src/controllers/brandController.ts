import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { BRAND_ERROR, COMMON_ERROR } from "../constants/errorMessage";
import { BRAND_SUCCESS } from "../constants/successMessage";

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: BRAND_ERROR.VALIDATION,
      });
    }

    // 로고 이미지 URL 처리
    const logoImageUrl = req.file 
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    const newBrand = await prisma.brand.create({
      data: {
        name,
        logoImageUrl,
      },
    });

    console.log(newBrand);

    return res.status(201).json({
      message: BRAND_SUCCESS.CREATE,
      products: newBrand,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const getAllBrand = async (req: Request, res: Response) => {
  try {
    const findAllBrand = await prisma.brand.findMany();

    console.log(findAllBrand);

    return res.status(200).json({
      message: BRAND_SUCCESS.FETCH,
      products: findAllBrand,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
