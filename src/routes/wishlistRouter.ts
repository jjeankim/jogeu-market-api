import express from "express";
import { authenticateJWT } from "../middleware/auth";
import {
  createWish,
  deleteWish,
  getWish,
} from "../controllers/wishlistController";

const wishRouter = express.Router();

wishRouter.route("/").post(authenticateJWT, createWish);
wishRouter.route("/").get(authenticateJWT, getWish);
wishRouter.route("/:id").delete(authenticateJWT, deleteWish);

export default wishRouter;
