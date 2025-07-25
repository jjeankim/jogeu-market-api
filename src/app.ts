import express, { Request, Response } from "express";
import prisma from "./lib/prisma";
import { productRouter } from "./routes/productReviewRouter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products/:id/reviews",productRouter)

app.listen(4000, () => {
  console.log("Server running on port 4000");
});

// 데이터베이스와의 연결 종료
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisam 연결 종료");
  process.exit();
});
