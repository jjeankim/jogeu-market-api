"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const addressSchema_1 = require("../validator/addressSchema");
const validate_1 = require("../middleware/validate");
const addressController_1 = require("../controllers/addressController");
const userRouter = (0, express_1.Router)();
userRouter.get("/me", auth_1.authenticateJWT, userController_1.getMe);
// 비밀번호 변경
userRouter.patch("/me/password", auth_1.authenticateJWT, userController_1.updatePassword);
// 배송지 추가
userRouter.post("/me/addresses", auth_1.authenticateJWT, (0, validate_1.validateBody)(addressSchema_1.createAddressSchema), addressController_1.createAddress);
// 배송지 수정
userRouter.put("/me/addresses/:id", auth_1.authenticateJWT, (0, validate_1.validateBody)(addressSchema_1.updateAddressSchema), addressController_1.putAddress);
userRouter.patch("/me/addresses/:id/default", auth_1.authenticateJWT, addressController_1.patchAddress);
// 사용자의 등록한 전체 배송지 조회
userRouter.get("/me/addresses", auth_1.authenticateJWT, addressController_1.getAllAddress);
exports.default = userRouter;
