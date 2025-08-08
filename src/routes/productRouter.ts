import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  getLandingProducts,
  getOneProduct,
  getSearchProducts,
  createProductQnA,
  getProductQnA,
  fetchProductAnswers,
} from "../controllers/productController";
import { getSingleUploader } from "../middleware/upload";
import { authenticateJWT } from "../middleware/auth";

const productRouter = Router();

productRouter.get("/landing", getLandingProducts);

productRouter
  .route("/")
  .post(authenticateJWT, getSingleUploader("thumbnailImageUrl"), createProduct)
  .get(getAllProduct);

productRouter.get("/search", getSearchProducts);

productRouter
  .route("/:id/qna")
  .post(authenticateJWT, createProductQnA)
  .get(getProductQnA)

productRouter.patch("/:id/qna/:qnaId", fetchProductAnswers);

productRouter.get("/:id", getOneProduct);

export default productRouter;
