"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brandController_1 = require("../controllers/brandController");
const brandRouter = (0, express_1.Router)();
brandRouter.post("/", brandController_1.createBrand);
brandRouter.get("/", brandController_1.getAllBrand);
exports.default = brandRouter;
