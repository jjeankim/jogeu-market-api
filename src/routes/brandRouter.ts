import { Router } from "express";
import { createBrand, getAllBrand } from "../controllers/brandController";

const brandRouter = Router();
brandRouter.post("/", createBrand);
brandRouter.get("/", getAllBrand);

export default brandRouter;
