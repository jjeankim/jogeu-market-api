import { Response, RequestHandler } from "express";
import prisma from "../lib/prisma";

export const getCategory: RequestHandler = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("카테고리 조회 실패", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};
