"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const productReviewRouter_1 = __importDefault(require("./routes/productReviewRouter"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
require("dotenv/config");
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const brandRouter_1 = __importDefault(require("./routes/brandRouter"));
const cartRouter_1 = __importDefault(require("./routes/cartRouter"));
const orderRouter_1 = __importDefault(require("./routes/orderRouter"));
const wishlistRouter_1 = __importDefault(require("./routes/wishlistRouter"));
const sampleRouter_1 = __importDefault(require("./routes/sampleRouter"));
const couponRouter_1 = __importDefault(require("./routes/couponRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const categoryRouter_1 = __importDefault(require("./routes/categoryRouter"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
// 정적 파일 서빙 (시드 이미지: /B_no_bg, /F_no_bg, /L_no_bg, /P_no_bg 경로)
app.use(express_1.default.static("public"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use("/api/products/:id/reviews", productReviewRouter_1.default);
app.use("/api/auth", authRouter_1.default);
app.use("/api/users", userRouter_1.default);
app.use("/api/brand", brandRouter_1.default);
app.use("/api/product", productRouter_1.default);
app.use("/api/cart", cartRouter_1.default);
app.use("/api/wishlist", wishlistRouter_1.default);
app.use("/api/coupon", couponRouter_1.default);
app.use("/api/orders", orderRouter_1.default);
app.use("/api/samples", sampleRouter_1.default);
app.use("/api/categories", categoryRouter_1.default);
// 404 핸들러
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});
// 라우트 처리 중 예외나 next(err)로 전달된 에러 잡아서 처리
app.use(errorHandler_1.errorHandler);
app.listen(4000, () => {
    console.log("Server running on port 4000");
});
// 데이터베이스와의 연결 종료
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
    console.log("Prisma 연결 종료");
    process.exit();
}));
