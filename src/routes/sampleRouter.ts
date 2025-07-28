import express from "express";
import {
  createSampleOrder,
  getSampleList,
} from "../controllers/sampleController";
import { authenticateJWT } from "../middleware/auth";

const sampleRouter = express.Router();

sampleRouter.get("/", getSampleList);
sampleRouter.post("/orders", authenticateJWT, createSampleOrder);

export default sampleRouter;
