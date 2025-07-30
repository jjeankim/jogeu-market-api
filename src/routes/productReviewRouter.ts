import express from "express";
import {
  createProductReview,
  createReviewTag,
  deleteProductReview,
  getProductReviews,
  getReviewTags,
  likeProductReview,
  unlikeProductReview,
  updateProductReview,
} from "../controllers/productReviewController";
import { authenticateJWT } from "../middleware/auth";
import { getSingleUploader } from "../middleware/upload";

const productReviewRouter = express.Router({ mergeParams: true });

productReviewRouter
  .route("/")
  .get(getProductReviews)
  .post(authenticateJWT, getSingleUploader("imageUrl"), createProductReview);

productReviewRouter
  .route("/:reviewId")
  .put(authenticateJWT, updateProductReview)
  .delete(authenticateJWT, deleteProductReview);

productReviewRouter
  .route("/:reviewId/like")
  .post(authenticateJWT, likeProductReview)
  .delete(authenticateJWT, unlikeProductReview);

productReviewRouter
  .route("/:reviewId/tags")
  .get(getReviewTags)
  .post(authenticateJWT, createReviewTag);

export default productReviewRouter;
