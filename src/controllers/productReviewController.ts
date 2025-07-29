import { Response, RequestHandler } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";

// 상품 리뷰 가져오기
export const getProductReviews: RequestHandler = async (req, res) => {
  const productId = Number(req.params.id);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  try {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.review.count({ where: { productId } }),
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

//상품 리뷰 작성하기
export const createProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자 입니다." });
  }

  const productId = Number(req.params.id);
  const { rating, reviewText } = req.body;

  try {
    const review = await prisma.review.create({
      data: {
        rating,
        reviewText,
        productId,
        userId,
      },
    });
    return res.status(201).json({ message: "ok", data: review });
  } catch (error) {
    console.error("상품 리뷰 작성 실패", error);
    return res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

// 상품 리뷰 수정하기
export const updateProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자 입니다." });
  }

  const productId = Number(req.params.id);
  const reviewId = Number(req.params.reviewId);

  try {
    // 리뷰가 존재하는지, 해당 상품의 리뷰인지, 요청한 사용자의 리뷰인지 확인
    const review = await prisma.review.findFirst({
      where: { id: reviewId, productId, userId },
    });

    if (!review) {
      return res
        .status(404)
        .json({ message: "해당 리뷰를 찾을 수 없거나 수정 권한이 없습니다." });
    }

    // 리뷰 업데이트
    const updateReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        // put을 patch처럼 업데이트(리소스를 모두 변경하지 않고, 변경하고 싶은 것만 변경하도록)
        // 유효성 검사 해야함
        ...req.body,
      },
    });
    return res.status(200).json({
      message: "리뷰가 성공적으로 수정되었습니다.",
      review: updateReview,
    });
  } catch (error) {
    console.error("리뷰 수정 중 오류 발생: ", error);
    return res.status(500).json({ message: "서버 오류 발생 " });
  }
};

// 상품 리뷰 삭제하기
export const deleteProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자 입니다." });
  }

  const productId = Number(req.params.id);
  const reviewId = Number(req.params.reviewId);

  try {
    await prisma.review.delete({
      where: { id: reviewId, productId },
    });
    return res.sendStatus(204);
  } catch (error) {
    console.error("리뷰 삭제 중 에러 발생: ", error);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
};

// 상품 리뷰 좋아요
export const likeProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자 입니다." });
  }

  const productId = Number(req.params.id);
  const reviewId = Number(req.params.reviewId);

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId, productId },
      select: { likesCount: true }, // likesCount 필드만 가져와 불필요한 데이터 I/O 줄임
    });
    if (review && review.likesCount >= 0) {
      await prisma.review.update({
        where: { id: reviewId, productId },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });
    }
    return res.status(201).json({ message: "리뷰 좋아요 성공" });
  } catch (error) {
    console.error("리뷰 좋아요 중 에러 발생: ", error);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
};

// 상품 리뷰 좋아요 취소
export const unlikeProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "유효하지 않은 사용자 입니다." });
  }

  const productId = Number(req.params.id);
  const reviewId = Number(req.params.reviewId);

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId, productId },
      select: { likesCount: true },
    });
    if (review && review.likesCount > 0) {
      await prisma.review.update({
        where: { id: reviewId },
        data: {
          likesCount: { decrement: 1 },
        },
      });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error("리뷰 좋아요 취소 중 에러 발생: ", error);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
};
