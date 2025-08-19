import { Router } from "express";
import { getMe, updatePassword, updateUserInfo } from "../controllers/userController";
import { authenticateJWT } from "../middleware/auth";
import {
  createAddressSchema,
  updateAddressSchema,
} from "../validator/addressSchema";
import { validateBody } from "../middleware/validate";
import {
  createAddress,
  getAllAddress,
  patchAddress,
  putAddress,
} from "../controllers/addressController";

const userRouter = Router();

userRouter.get("/me", authenticateJWT, getMe);

// 사용자 정보 업데이트
userRouter.patch("/me", authenticateJWT, updateUserInfo);

// 비밀번호 변경
userRouter.patch("/me/password", authenticateJWT, updatePassword);

// 배송지 추가
userRouter.post(
  "/me/addresses",
  authenticateJWT,
  validateBody(createAddressSchema),
  createAddress
);

// 배송지 수정
userRouter.put(
  "/me/addresses/:id",
  authenticateJWT,
  validateBody(updateAddressSchema),
  putAddress
);

userRouter.patch("/me/addresses/:id/default", authenticateJWT, patchAddress);

// 사용자의 등록한 전체 배송지 조회
userRouter.get("/me/addresses", authenticateJWT, getAllAddress);

export default userRouter;
