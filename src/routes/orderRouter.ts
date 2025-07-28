import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticateJWT } from "../middleware/auth";

const orderRouter = express.Router();

orderRouter.route("/").post(authenticateJWT, createOrder);
orderRouter.route("/").get(authenticateJWT, getAllOrders);
orderRouter.route("/:id").get(authenticateJWT, getOrder);
orderRouter.route("/:id/status").patch(authenticateJWT, updateOrderStatus);

export default orderRouter;
