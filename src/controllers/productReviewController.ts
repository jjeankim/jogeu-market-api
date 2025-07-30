import { Response, RequestHandler } from "express";
import prisma from "../lib/prisma";
import { UserRequest } from "../types/expressUserRequest";
import { Prisma } from "@prisma/client";
import { REVIEW_SUCCESS } from "../constants/successMessage";
import {
  COMMON_ERROR,
  REQUEST_ERROR,
  REVIEW_ERROR,
} from "../constants/errorMessage";

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
      message: REVIEW_SUCCESS.GET_LIST,
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
    res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

//상품 리뷰 작성하기
export const createProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
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
    return res
      .status(201)
      .json({ message: REVIEW_SUCCESS.CREATE, data: review });
  } catch (error) {
    console.error("상품 리뷰 작성 실패", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 상품 리뷰 수정하기
export const updateProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
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
        .json({ message: REVIEW_ERROR.NOT_FOUND_OR_UNAUTHORIZED });
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
      message: REVIEW_SUCCESS.UPDATE,
      review: updateReview,
    });
  } catch (error) {
    console.error("리뷰 수정 중 에러 발생: ", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 상품 리뷰 삭제하기
export const deleteProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
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
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 상품 리뷰 좋아요
export const likeProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
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
    return res.status(201).json({ message: REVIEW_SUCCESS.LIKE });
  } catch (error) {
    console.error("리뷰 좋아요 중 에러 발생: ", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 상품 리뷰 좋아요 취소
export const unlikeProductReview = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
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
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 상품 태그 목록 가져오기
export const getReviewTags: RequestHandler = async (req, res) => {
  const productId = Number(req.params.id);
  const reviewId = Number(req.params.reviewId);

  try {
    const reviewTagList = await prisma.review.findUnique({
      where: { id: reviewId, productId },
      select: {
        reviewTags: {
          select: {
            tagKeyword: true,
          },
        },
      },
    });

    if (!reviewTagList) {
      return res.status(404).json({ message: REVIEW_ERROR.NOT_FOUND });
    }
    res
      .status(200)
      .json({ message: REVIEW_SUCCESS.GET_LIST, data: reviewTagList });
  } catch (error) {
    console.error("리뷰 태그 목록 조회 중 에러 발생", error);
    res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// 상품 태그 추가하기
export const createReviewTag = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }

  const productId = Number(req.params.id);
  const reviewId = Number(req.params.reviewId);
  const tagKeyword = req.body.tagKeyword?.trim(); // 공백제거
  const validTag = /^[가-힣a-zA-Z0-9]+$/;

  if (!tagKeyword || !validTag.test(tagKeyword)) {
    return res.status(400).json({
      message: REVIEW_ERROR.TAG_INVALID,
    });
  }

  try {
    // 해당 리뷰가 사용자의 것이고 해당 상품에 속해 있는지 확인
    const review = await prisma.review.findFirst({
      where: { id: reviewId, productId, userId },
    });

    if (!review) {
      return res
        .status(404)
        .json({ message: REVIEW_ERROR.NOT_FOUND_OR_UNAUTHORIZED });
    }

    // 태그 생성
    const newTag = await prisma.reviewTag.create({
      data: {
        reviewId,
        tagKeyword,
      },
    });
    res.status(201).json({
      message: REVIEW_SUCCESS.TAG_CREATE,
      data: newTag,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: REVIEW_ERROR.TAG_DUPLICATE,
        });
      }
    }
    console.error("상품 태그 추가 중 에러 발생: ", error);
    res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
