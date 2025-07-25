import { Request, RequestHandler } from "express";
import prisma from "../lib/prisma";

// 상품 리뷰 가져오기
export const getProductReviews: RequestHandler = async (req, res) => {
  const product_id = Number(req.params.id);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  try {
    const [reviews, total] = await Promise.all([
      prisma.reviews.findMany({
        where: { product_id },
        orderBy: { created_at: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.reviews.count({ where: { product_id } }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    res.status(200).json({
      message: "상품 리뷰 목록 가져오기 성공",
      data: reviews,
      pagination: {
        total,
        page,
        totalPages,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    console.error("상품 리뷰 목록 가져오기 실패", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

// 상품 리뷰 작성하기
// export const createProductReview = async (req:Request, res:Response) => {
//   const user_id = req.user?.id;
//   if(!user_id) {
//     res.status(401).json({message: "유효하지 않은 사용자 입니다."})
//     return
//   }
//   const product_id = Number(req.params.id);
//   const { rating, review_text } = req.body;

//   try {
//     const review = await prisma.reviews.create({
//       data:{
//         rating,
//         review_text,
//         product_id,
//         user_id,
//       }
//     })
//     res.status(201).json({message:"ok", data: review})
//   } catch (error) {
//     console.error("상품 리뷰 작성 실패", error);
//     res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
//   }
// };
