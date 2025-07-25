import { Router } from "express";
import { createCart } from "../controllers/cartController";
import { authenticateJWT } from "../middleware/auth";

const cartRouter = Router();
cartRouter.post("/",authenticateJWT, createCart);

export default cartRouter;
