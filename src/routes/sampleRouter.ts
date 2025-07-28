import express from "express";
import { getSampleList } from "../controllers/sampleController";

const sampleRouter = express.Router();

sampleRouter.get("/", getSampleList);

export default sampleRouter