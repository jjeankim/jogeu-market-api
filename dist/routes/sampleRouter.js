"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sampleController_1 = require("../controllers/sampleController");
const auth_1 = require("../middleware/auth");
const sampleRouter = express_1.default.Router();
sampleRouter.get("/", sampleController_1.getSampleList);
sampleRouter.post("/orders", auth_1.authenticateJWT, sampleController_1.createSampleOrder);
exports.default = sampleRouter;
