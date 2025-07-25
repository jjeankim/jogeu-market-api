import express from "express";
import {
  createProductReview,
  getProductReviews,
} from "../controllers/productReviewController";
import { authenticateJWT } from "../middleware/auth";

export const productRouter = express.Router({ mergeParams: true });

productRouter
  .route("/")
  .get(getProductReviews)
  .post(authenticateJWT, createProductReview);
