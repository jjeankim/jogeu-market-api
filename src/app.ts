import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("ok");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
