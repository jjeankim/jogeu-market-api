import { Router } from "express";
import { createCart } from "../controllers/cartController";

const cartRouter = Router();
cartRouter.post("/", createCart);

export default cartRouter;
