"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const orderRouter = express_1.default.Router();
orderRouter.route("/").post(auth_1.authenticateJWT, orderController_1.createOrder);
orderRouter.route("/").get(auth_1.authenticateJWT, orderController_1.getAllOrders);
orderRouter.route("/:id").get(auth_1.authenticateJWT, orderController_1.getOrder);
orderRouter.route("/:id/status").patch(auth_1.authenticateJWT, orderController_1.updateOrderStatus);
exports.default = orderRouter;
