import express from "express"
import { createOrder, getOrder } from "../controllers/orerController"
import { authenticateJWT } from "../middleware/auth"

const orderRouter = express.Router()

orderRouter.route("/").post(authenticateJWT,createOrder)

orderRouter.route("/:id").get(authenticateJWT,getOrder)

export default orderRouter