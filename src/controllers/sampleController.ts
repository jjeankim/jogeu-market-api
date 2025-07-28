import { RequestHandler } from "express";
import prisma from "../lib/prisma";
import { getPagination } from "../utils/pagination";

export const getSampleList: RequestHandler = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  try {
    const [sampleList, total] = await Promise.all([
      prisma.product.findMany({
        where: { isSample: true },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.product.count({
        where: { isSample: true },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    return res.status(200).json({
      message: "샘플 목록 조회 성공",
      data: sampleList,
      pagination: {
        total,
        page,
        totalPages,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    console.error("샘플 상품 목록 가져오기 실패", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};
