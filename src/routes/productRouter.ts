import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  getLandingProducts,
  getOneProduct,
} from "../controllers/productController";
import { getSingleUploader } from "../middleware/upload";
import { authenticateJWT } from "../middleware/auth";

const productRouter = Router();

productRouter.get("/landing", getLandingProducts);

productRouter
  .route("/")
  .post(authenticateJWT, getSingleUploader("thumbnailImageUrl"), createProduct)
  .get(getAllProduct);

productRouter.get("/:id", getOneProduct);

export default productRouter;
