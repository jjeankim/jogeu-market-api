import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  getOneProduct,
} from "../controllers/productController";

const ProductRouter = Router();
ProductRouter.post("/", createProduct);
ProductRouter.get("/", getAllProduct);
ProductRouter.get("/:id", getOneProduct);

export default ProductRouter;
