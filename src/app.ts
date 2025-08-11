import express, { Request, Response } from "express";
import prisma from "./lib/prisma";
import productReviewRouter from "./routes/productReviewRouter";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import brandRouter from "./routes/brandRouter";
import cartRouter from "./routes/cartRouter";
import orderRouter from "./routes/orderRouter";

import wishlistRouter from "./routes/wishlistRouter";
import sampleRouter from "./routes/sampleRouter";
import couponRouter from "./routes/couponRouter";
import cookieParser from "cookie-parser";
import productRouter from "./routes/productRouter";
import categoryRouter from "./routes/categoryRouter";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/products/:id/reviews", productReviewRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/orders", orderRouter);
app.use("/api/samples", sampleRouter);
app.use("/api/categories", categoryRouter);

// 404 핸들러
app.use((req,res) => {
  res.status(404).json({message: "Not Found"});
})

// 라우트 처리 중 예외나 next(err)로 전달된 에러 잡아서 처리
app.use(errorHandler)

app.listen(4000, () => {
  console.log("Server running on port 4000");
});

// 데이터베이스와의 연결 종료
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma 연결 종료");
  process.exit();
});
