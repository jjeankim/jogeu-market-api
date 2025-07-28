import express from "express";
import {
  createProductReview,
  getProductReviews,
} from "../controllers/productReviewController";
import { authenticateJWT } from "../middleware/auth";

const productReviewRouter = express.Router({ mergeParams: true });

productReviewRouter
  .route("/")
  .get(getProductReviews)
  .post(authenticateJWT, createProductReview);

  export default productReviewRouter;