"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const wishlistController_1 = require("../controllers/wishlistController");
const wishRouter = express_1.default.Router();
wishRouter.route("/").post(auth_1.authenticateJWT, wishlistController_1.createWish);
wishRouter.route("/").get(auth_1.authenticateJWT, wishlistController_1.getWish);
wishRouter.route("/:id").delete(auth_1.authenticateJWT, wishlistController_1.deleteWish);
exports.default = wishRouter;
