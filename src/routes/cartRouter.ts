import { Router } from "express";
import { authenticateJWT } from "../middleware/auth";
import {
  createCart,
  getCart,
  patchCart,
  deleteCart,
} from "../controllers/cartController";

const cartRouter = Router();


cartRouter
  .post("/", authenticateJWT, createCart)
  .get("/", authenticateJWT, getCart)
  .patch("/:id", authenticateJWT, patchCart)
  .delete("/:id", authenticateJWT, deleteCart);

export default cartRouter;
