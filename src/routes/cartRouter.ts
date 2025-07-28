import { Router } from "express";

import {
  createCart,
  getCart,
  patchCart,
  deleteCart,
} from "../controllers/cartController";

const cartRouter = Router();
cartRouter.post("/", createCart);
cartRouter.get("/", getCart);
cartRouter.patch("/:id", patchCart);
cartRouter.delete("/:id", deleteCart);

export default cartRouter;
