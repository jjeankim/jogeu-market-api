import { Router } from "express";
import { getMe } from "../controllers/userController";
import { authenticateJWT } from "../middleware/auth";

const userRouter = Router();

userRouter.get("/me", authenticateJWT, getMe);

export default userRouter;
