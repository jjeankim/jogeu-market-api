"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const cartController_1 = require("../controllers/cartController");
const cartRouter = (0, express_1.Router)();
cartRouter
    .post("/", auth_1.authenticateJWT, cartController_1.createCart)
    .get("/", auth_1.authenticateJWT, cartController_1.getCart)
    .patch("/:id", auth_1.authenticateJWT, cartController_1.patchCart)
    .delete("/:id", auth_1.authenticateJWT, cartController_1.deleteCart)
    .post("/merge-duplicates", auth_1.authenticateJWT, cartController_1.mergeDuplicateCartItems);
exports.default = cartRouter;
