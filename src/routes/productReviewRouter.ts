import express from "express";
import { getProductReviews } from "../controllers/producttReviewController";

export const productRouter = express.Router({mergeParams:true});

productRouter.get("/",getProductReviews);
