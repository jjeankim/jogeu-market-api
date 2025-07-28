import express, { Request, Response } from "express";
import prisma from "./lib/prisma";
import productReviewRouter from "./routes/productReviewRouter";
import cors from "cors";

import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import ProductRouter from "./routes/productRouter";
import userRouter from "./routes/userRouter";
import brandRouter from "./routes/brandRouter";
import cartRouter from "./routes/cartRouter";
import orderRouter from "./routes/orderRouter";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api/products/:id/reviews", productReviewRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.use("/api/brand", brandRouter);
app.use("/api/product", ProductRouter);
app.use("/api/cart", cartRouter);

app.use("/api/orders", orderRouter);


app.listen(4000, () => {
  console.log("Server running on port 4000");
});

// 데이터베이스와의 연결 종료
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisam 연결 종료");
  process.exit();
});
