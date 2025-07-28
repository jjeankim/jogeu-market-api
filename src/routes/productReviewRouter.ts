import express from "express";
import {
  createProductReview,
  getProductReviews,
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
  .delete(authenticateJWT);

export default productReviewRouter;
