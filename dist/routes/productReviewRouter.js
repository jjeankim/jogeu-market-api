"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productReviewController_1 = require("../controllers/productReviewController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const productReviewRouter = express_1.default.Router({ mergeParams: true });
productReviewRouter
    .route("/")
    .get(productReviewController_1.getProductReviews)
    .post(auth_1.authenticateJWT, (0, upload_1.getSingleUploader)("imageUrl"), productReviewController_1.createProductReview);
productReviewRouter
    .route("/:reviewId")
    .put(auth_1.authenticateJWT, (0, upload_1.getSingleUploader)("imageUrl"), productReviewController_1.updateProductReview)
    .delete(auth_1.authenticateJWT, productReviewController_1.deleteProductReview);
productReviewRouter
    .route("/:reviewId/like")
    .post(auth_1.authenticateJWT, productReviewController_1.likeProductReview)
    .delete(auth_1.authenticateJWT, productReviewController_1.unlikeProductReview);
productReviewRouter
    .route("/:reviewId/tags")
    .get(productReviewController_1.getReviewTags)
    .post(auth_1.authenticateJWT, productReviewController_1.createReviewTag);
productReviewRouter.get("/stats", productReviewController_1.getProductReviewStats);
exports.default = productReviewRouter;
