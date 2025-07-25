import express from "express";
import { getProductReviews } from "../controllers/productReviewController";

export const productRouter = express.Router({mergeParams:true});

productRouter.route("/").get(getProductReviews);
