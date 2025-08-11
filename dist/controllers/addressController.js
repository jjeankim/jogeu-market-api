"use strict";
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
exports.getAllAddress = exports.patchAddress = exports.putAddress = exports.createAddress = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorMessage_1 = require("../constants/errorMessage");
const successMessage_1 = require("../constants/successMessage");
// 배송지 등록
const createAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipientName, recipientPhone, addressLine1, addressLine2, postCode, } = req.body;
    try {
        const address = yield prisma_1.default.address.create({
            data: {
                userId: req.user.id,
                recipientName,
                recipientPhone,
                addressLine1,
                addressLine2,
                postCode,
                isDefault: false,
            },
        });
        res.status(201).json({ message: successMessage_1.ADDRESS_SUCCESS.CREATE, address });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.createAddress = createAddress;
// 배송지 수정
const putAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const addressId = Number(req.params.id);
    const userId = req.user.id;
    const { recipientName, recipientPhone, addressLine1, addressLine2, postCode, } = req.body;
    try {
        const existing = yield prisma_1.default.address.findUnique({
            where: { id: addressId },
        });
        if (!existing || existing.userId !== userId) {
            return res.status(404).json({ message: errorMessage_1.ADDRESS_ERROR.NOT_FOUND });
        }
        const updated = yield prisma_1.default.address.update({
            where: { id: addressId },
            data: {
                recipientName,
                recipientPhone,
                addressLine1,
                addressLine2,
                postCode,
                isDefault: false,
            },
        });
        return res
            .status(200)
            .json({ message: successMessage_1.ADDRESS_SUCCESS.UPDATE, data: updated });
    }
    catch (error) {
        console.error("배송지 수정 실패 : ", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.putAddress = putAddress;
// 기본 배송지 등록
const patchAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const addressId = Number(req.params.id);
    const userId = req.user.id;
    try {
        const target = yield prisma_1.default.address.findUnique({
            where: { id: addressId },
        });
        if (!target || target.userId !== userId) {
            return res.status(404).json({ message: errorMessage_1.ADDRESS_ERROR.NOT_FOUND });
        }
        yield prisma_1.default.address.updateMany({
            where: {
                userId: userId,
                isDefault: true,
            },
            data: {
                isDefault: false,
            },
        });
        const updateAddress = yield prisma_1.default.address.update({
            where: {
                id: addressId,
            },
            data: {
                isDefault: true,
            },
        });
        return res.status(200).json({
            message: successMessage_1.ADDRESS_SUCCESS.SET_DEFAULT,
            data: updateAddress,
        });
    }
    catch (error) {
        console.error("기본 배송지 변경 에러 :", error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.patchAddress = patchAddress;
// 등록한 전체 배송지 가져오기
const getAllAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const findAllAddress = yield prisma_1.default.address.findMany({
            where: { userId: userId },
        });
        return res.status(200).json({
            message: successMessage_1.ADDRESS_SUCCESS.GET_ALL,
            data: findAllAddress,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.getAllAddress = getAllAddress;
