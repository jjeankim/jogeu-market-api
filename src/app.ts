import express, { Request, Response } from "express";

import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import ProductRouter from "./routes/productRouter";
import brandRouter from "./routes/brandRouter";
import cartRouter from "./routes/cartRouter";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/brand", brandRouter);
app.use("/api/product", ProductRouter);
app.use("/api/cart", cartRouter);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
