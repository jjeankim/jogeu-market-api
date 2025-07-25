import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "브랜드 이름은 필수 입력입니다.",
      });
    }

    const newBrand = await prisma.brand.create({
      data: {
        name,
      },
    });

    console.log(newBrand);

    return res.status(201).json({
      message: "✅ 브랜드가 성공적으로 등록되었습니다.",
      products: newBrand,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const getAllBrand = async (req: Request, res: Response) => {
  try {
    const findAllBrand = await prisma.brand.findMany();

    console.log(findAllBrand);

    return res.status(200).json({
      message: "✅ 브랜드가 성공적으로 조회되었습니다.",
      products: findAllBrand,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
