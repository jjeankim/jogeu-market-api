"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const productRouter = (0, express_1.Router)();
productRouter.get("/landing", productController_1.getLandingProducts);
productRouter
    .route("/")
    .post(auth_1.authenticateJWT, (0, upload_1.getMultiUploader)([
    { name: "thumbnail", maxCount: 1 },
    { name: "detailImage", maxCount: 1 },
]), productController_1.createProduct)
    .get(productController_1.getAllProduct);
productRouter.get("/search", productController_1.getSearchProducts);
productRouter
    .route("/:id/qna")
    .post(auth_1.authenticateJWT, productController_1.createProductQnA)
    .get(productController_1.getProductQnA);
productRouter.patch("/:id/qna/:qnaId", productController_1.fetchProductAnswers);
productRouter.get("/:id", productController_1.getOneProduct);
exports.default = productRouter;
