import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  getOneProduct,
} from "../controllers/productController";
import { getSingleUploader } from "../middleware/upload";
import { authenticateJWT } from "../middleware/auth";

const ProductRouter = Router();

ProductRouter.route("/")
  .post(authenticateJWT,getSingleUploader("thumbnailImageUrl"), createProduct)
  .get(getAllProduct);
ProductRouter.get("/:id", getOneProduct);

export default ProductRouter;
