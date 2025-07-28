import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
} from "../controllers/orerController";
import { authenticateJWT } from "../middleware/auth";

const orderRouter = express.Router();

orderRouter.route("/").post(authenticateJWT, createOrder);
orderRouter.route("/").get(authenticateJWT, getAllOrders);
orderRouter.route("/:id").get(authenticateJWT, getOrder);

export default orderRouter;
