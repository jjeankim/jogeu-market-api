"use strict";
//  userController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.getMe = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errorMessage_1 = require("../constants/errorMessage");
const successMessage_1 = require("../constants/successMessage");
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || "10");
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(`req.user :${JSON.stringify(req.user)}`);
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            addresses: true,
        },
    });
    if (!user) {
        return res.status(404).json({ message: errorMessage_1.USER_ERROR.USER_NOT_FOUND });
    }
    res.status(200).json(user);
});
exports.getMe = getMe;
// 비밀번호 변경 (사용자 본인의 속성 변경)
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: errorMessage_1.USER_ERROR.PASSWORD_REQUIRED });
    }
    if (currentPassword === newPassword) {
        return res.status(400).json({ message: errorMessage_1.USER_ERROR.SAME_AS_OLD_PASSWORD });
    }
    try {
        // 현재 사용자 정보 조회
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { password: true }, //보안을 위해 비밀번호만 선택적으로 가져옴
        });
        if (!user) {
            return res.status(404).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
        }
        // 현재 비밀번호가 일치하는지 확인
        const isPasswordMatch = yield bcryptjs_1.default.compare(currentPassword, user === null || user === void 0 ? void 0 : user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: errorMessage_1.USER_ERROR.PASSWORD_INCORRECT });
        }
        // 새 비밀번호 해싱
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, SALT_ROUNDS);
        yield prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        // 변경이 성공적이라면 front에서 토스트로 해당 메세지를 띄워주면 될 것 같은 느낌적인 느낌?
        return res.status(200).json({ message: successMessage_1.USER_SUCCESS.PASSWORD_UPDATED });
    }
    catch (error) {
        console.error("비밀번호 변경 중 에러:", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.updatePassword = updatePassword;
