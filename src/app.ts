import express from "express";
import prisma from "./lib/prisma";
import productReviewRouter from "./routes/productReviewRouter";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import "dotenv/config";
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
import helmet from "helmet";
import compression from "compression";
import oauthRouter from "./routes/oauthRouter";

const app = express();
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowerdOrigin = process.env.CLIENT_ORIGIN?.split(",");
app.use(cors({ origin: allowerdOrigin, credentials: true }));
// 정적 파일 서빙 (시드 이미지: /B_no_bg, /F_no_bg, /L_no_bg, /P_no_bg 경로)
app.use(express.static("public"));

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
app.use("/api/auth",oauthRouter);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// 라우트 처리 중 예외나 next(err)로 전달된 에러 잡아서 처리
app.use(errorHandler);

// DB 연결 시도
(async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");

    // 서버 시작
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

// 안전한 종료 처리
const shutdown = async () => {
  await prisma.$disconnect();
  console.log("🔌 Prisma 연결 종료");
  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
