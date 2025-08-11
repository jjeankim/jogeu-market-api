"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewTag = exports.getReviewTags = exports.unlikeProductReview = exports.likeProductReview = exports.deleteProductReview = exports.updateProductReview = exports.createProductReview = exports.getProductReviews = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const successMessage_1 = require("../constants/successMessage");
const errorMessage_1 = require("../constants/errorMessage");
// 상품 리뷰 가져오기
const getProductReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = Number(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const [reviews, total] = yield Promise.all([
            prisma_1.default.review.findMany({
                where: { productId },
                orderBy: { createdAt: "desc" },
                skip: offset,
                take: limit,
            }),
            prisma_1.default.review.count({ where: { productId } }),
        ]);
        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;
        res.status(200).json({
            message: successMessage_1.REVIEW_SUCCESS.GET_LIST,
            data: reviews,
            pagination: {
                total,
                page,
                totalPages,
                limit,
                hasMore,
            },
        });
    }
    catch (error) {
        console.error("상품 리뷰 목록 가져오기 실패", error);
        res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.getProductReviews = getProductReviews;
//상품 리뷰 작성하기
const createProductReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const productId = Number(req.params.id);
    const { rating, reviewText, orderItemId } = req.body;
    //Azure 업로드 결과 사용
    const f = req.file;
    const imageUrl = (_b = f === null || f === void 0 ? void 0 : f.url) !== null && _b !== void 0 ? _b : null;
    try {
        const review = yield prisma_1.default.review.create({
            data: {
                rating: Number(rating),
                reviewText,
                orderItemId: Number(orderItemId),
                productId,
                userId,
                imageUrl,
            },
        });
        return res
            .status(201)
            .json({ message: successMessage_1.REVIEW_SUCCESS.CREATE, data: review });
    }
    catch (error) {
        console.error("상품 리뷰 작성 실패", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.createProductReview = createProductReview;
// 상품 리뷰 수정하기
const updateProductReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const productId = Number(req.params.id);
    const reviewId = Number(req.params.reviewId);
    try {
        // 리뷰가 존재하는지, 해당 상품의 리뷰인지, 요청한 사용자의 리뷰인지 확인
        const review = yield prisma_1.default.review.findFirst({
            where: { id: reviewId, productId, userId },
        });
        if (!review) {
            return res
                .status(404)
                .json({ message: errorMessage_1.REVIEW_ERROR.NOT_FOUND_OR_UNAUTHORIZED });
        }
        const imageUrl = req.file
            ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER}/${req.file.blobName}`
            : review.imageUrl;
        const updateReview = yield prisma_1.default.review.update({
            where: { id: reviewId },
            data: {
                rating: Number(req.body.rating),
                reviewText: req.body.reviewText,
                orderItemId: Number(req.body.orderItemId),
                imageUrl,
            },
        });
        return res.status(200).json({
            message: successMessage_1.REVIEW_SUCCESS.UPDATE,
            review: updateReview,
        });
    }
    catch (error) {
        console.error("리뷰 수정 중 에러 발생: ", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.updateProductReview = updateProductReview;
// 상품 리뷰 삭제하기 (sofe-delete)
const deleteProductReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const productId = Number(req.params.id);
    const reviewId = Number(req.params.reviewId);
    try {
        yield prisma_1.default.review.update({
            where: { id: reviewId },
            data: { isDeleted: true },
        });
        return res.sendStatus(204);
    }
    catch (error) {
        console.error("리뷰 삭제 중 에러 발생: ", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.deleteProductReview = deleteProductReview;
// 상품 리뷰 좋아요
const likeProductReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const productId = Number(req.params.id);
    const reviewId = Number(req.params.reviewId);
    try {
        const review = yield prisma_1.default.review.findUnique({
            where: { id: reviewId, productId },
            select: { likesCount: true }, // likesCount 필드만 가져와 불필요한 데이터 I/O 줄임
        });
        if (review && review.likesCount >= 0) {
            yield prisma_1.default.review.update({
                where: { id: reviewId, productId },
                data: {
                    likesCount: {
                        increment: 1,
                    },
                },
            });
        }
        return res.status(201).json({ message: successMessage_1.REVIEW_SUCCESS.LIKE });
    }
    catch (error) {
        console.error("리뷰 좋아요 중 에러 발생: ", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.likeProductReview = likeProductReview;
// 상품 리뷰 좋아요 취소
const unlikeProductReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const productId = Number(req.params.id);
    const reviewId = Number(req.params.reviewId);
    try {
        const review = yield prisma_1.default.review.findUnique({
            where: { id: reviewId, productId },
            select: { likesCount: true },
        });
        if (review && review.likesCount > 0) {
            yield prisma_1.default.review.update({
                where: { id: reviewId },
                data: {
                    likesCount: { decrement: 1 },
                },
            });
        }
        res.sendStatus(204);
    }
    catch (error) {
        console.error("리뷰 좋아요 취소 중 에러 발생: ", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.unlikeProductReview = unlikeProductReview;
// 상품 태그 목록 가져오기
const getReviewTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = Number(req.params.id);
    const reviewId = Number(req.params.reviewId);
    try {
        const reviewTagList = yield prisma_1.default.review.findUnique({
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
            return res.status(404).json({ message: errorMessage_1.REVIEW_ERROR.NOT_FOUND });
        }
        res
            .status(200)
            .json({ message: successMessage_1.REVIEW_SUCCESS.GET_LIST, data: reviewTagList });
    }
    catch (error) {
        console.error("리뷰 태그 목록 조회 중 에러 발생", error);
        res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.getReviewTags = getReviewTags;
// 상품 태그 추가하기
const createReviewTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const productId = Number(req.params.id);
    const reviewId = Number(req.params.reviewId);
    const tagKeyword = (_b = req.body.tagKeyword) === null || _b === void 0 ? void 0 : _b.trim(); // 공백제거
    const validTag = /^[가-힣a-zA-Z0-9]+$/;
    if (!tagKeyword || !validTag.test(tagKeyword)) {
        return res.status(400).json({
            message: errorMessage_1.REVIEW_ERROR.TAG_INVALID,
        });
    }
    try {
        // 해당 리뷰가 사용자의 것이고 해당 상품에 속해 있는지 확인
        const review = yield prisma_1.default.review.findFirst({
            where: { id: reviewId, productId, userId },
        });
        if (!review) {
            return res
                .status(404)
                .json({ message: errorMessage_1.REVIEW_ERROR.NOT_FOUND_OR_UNAUTHORIZED });
        }
        // 태그 생성
        const newTag = yield prisma_1.default.reviewTag.create({
            data: {
                reviewId,
                tagKeyword,
            },
        });
        res.status(201).json({
            message: successMessage_1.REVIEW_SUCCESS.TAG_CREATE,
            data: newTag,
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(409).json({
                    message: errorMessage_1.REVIEW_ERROR.TAG_DUPLICATE,
                });
            }
        }
        console.error("상품 태그 추가 중 에러 발생: ", error);
        res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.createReviewTag = createReviewTag;
