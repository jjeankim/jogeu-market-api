import { Router } from "express";
import { getCategory } from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.get("/", getCategory);

export default categoryRouter;
