import express from "express";
import {
  createProductReview,
  deleteProductReview,
  getProductReviews,
  likeProductReview,
  updateProductReview,
} from "../controllers/productReviewController";
import { authenticateJWT } from "../middleware/auth";

const productReviewRouter = express.Router({ mergeParams: true });

productReviewRouter
  .route("/")
  .get(getProductReviews)
  .post(authenticateJWT, createProductReview);

productReviewRouter
  .route("/:reviewId")
  .put(authenticateJWT, updateProductReview)
  .delete(authenticateJWT, deleteProductReview);

productReviewRouter
  .route("/:reviewId/like")
  .post(authenticateJWT, likeProductReview);

export default productReviewRouter;
