import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  getOneProduct,
} from "../controllers/productController";

const ProductRouter = Router();

ProductRouter.route("/").post(createProduct).get(getAllProduct);
ProductRouter.get("/:id", getOneProduct);

export default ProductRouter;
