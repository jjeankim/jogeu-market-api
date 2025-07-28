import { Router } from "express";
import { getMe, updatePassword } from "../controllers/userController";
import { authenticateJWT } from "../middleware/auth";

const userRouter = Router();

userRouter.get("/me", authenticateJWT, getMe);

// 비밀번호 변경
userRouter.patch("/me/password", authenticateJWT, updatePassword);

export default userRouter;
