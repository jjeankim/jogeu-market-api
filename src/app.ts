import express, { Request, Response } from "express";
import prisma from "./lib/prisma";
import productReviewRouter from "./routes/productReviewRouter";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import ProductRouter from "./routes/productRouter";
import userRouter from "./routes/userRouter";
import brandRouter from "./routes/brandRouter";
import cartRouter from "./routes/cartRouter";
import orderRouter from "./routes/orderRouter";

import wishlistRouter from "./routes/wishlistRouter";
import sampleRouter from "./routes/sampleRouter";
import CouponRouter from "./routes/couponRouter";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/products/:id/reviews", productReviewRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", ProductRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/coupon", CouponRouter);

app.use("/api/orders", orderRouter);
app.use("/api/samples", sampleRouter);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});

// 데이터베이스와의 연결 종료
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisam 연결 종료");
  process.exit();
});
