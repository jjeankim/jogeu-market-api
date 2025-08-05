import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  getOneProduct,
} from "../controllers/productController";
import { getSingleUploader } from "../middleware/upload";
import { authenticateJWT } from "../middleware/auth";

const productRouter = Router();

productRouter
  .route("/")
  .post(authenticateJWT, getSingleUploader("thumbnailImageUrl"), createProduct)
  .get(getAllProduct);

// productRouter.get("/", getBySubCategory);

productRouter.get("/:id", getOneProduct);

export default productRouter;
