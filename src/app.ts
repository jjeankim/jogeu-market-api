import express, { Request, Response } from "express";
import ProductRouter from "./routes/productRouter";
import brandRouter from "./routes/brandRouter";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("ok");
});

app.use("/api/brands", brandRouter);
app.use("/api/products", ProductRouter);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
