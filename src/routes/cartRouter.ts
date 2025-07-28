import { Router } from "express";

import { authenticateJWT } from "../middleware/auth";

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
