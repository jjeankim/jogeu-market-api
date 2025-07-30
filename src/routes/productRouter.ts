import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  getOneProduct,
} from "../controllers/productController";
import { getSingleUploader } from "../middleware/upload";

const ProductRouter = Router();

ProductRouter.route("/")
  .post(getSingleUploader("thumbnailImageUrl"), createProduct)
  .get(getAllProduct);
ProductRouter.get("/:id", getOneProduct);

export default ProductRouter;
