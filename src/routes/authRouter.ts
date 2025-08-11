import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", logout);

export default authRouter;
