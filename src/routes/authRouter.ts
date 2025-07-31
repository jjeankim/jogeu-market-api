import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/authController";

const Authrouter = Router();

Authrouter.post("/signup", signup);
Authrouter.post("/login", login);
Authrouter.post("/refresh", refreshToken);
Authrouter.post("/logout", logout);

export default Authrouter;
