import { Router } from "express";
import { login, refreshToken, signup } from "../controllers/authController";

const Authrouter = Router();

Authrouter.post("/signup", signup);
Authrouter.post("/login", login);
Authrouter.post("/tokens", refreshToken);

export default Authrouter;
