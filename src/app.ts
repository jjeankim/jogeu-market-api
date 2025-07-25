import express, { Request, Response } from "express";

import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import ProductRouter from "./routes/productRouter";
import brandRouter from "./routes/brandRouter";

dotenv.config();


const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);


app.use("/api/brands", brandRouter);
app.use("/api/products", ProductRouter);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
