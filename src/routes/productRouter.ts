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
import { getMultiUploader, getSingleUploader } from "../middleware/upload";
import { authenticateJWT } from "../middleware/auth";

const productRouter = Router();

productRouter.get("/landing", getLandingProducts);

productRouter
  .route("/")
  .post(
    authenticateJWT,
    getMultiUploader([
      { name: "thumbnail", maxCount: 1 },
      { name: "detailImage", maxCount: 1 },
    ]),
    createProduct
  )
  .get(getAllProduct);

productRouter.get("/search", getSearchProducts);

productRouter
  .route("/:id/qna")
  .post(authenticateJWT, createProductQnA)
  .get(getProductQnA)

productRouter.patch("/:id/qna/:qnaId", fetchProductAnswers);

productRouter.get("/:id", getOneProduct);

export default productRouter;
