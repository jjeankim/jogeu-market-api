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
exports.deleteWish = exports.getWish = exports.createWish = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorMessage_1 = require("../constants/errorMessage");
const successMessage_1 = require("../constants/successMessage");
// 위시리스트 상품 추가
const createWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const { productId } = req.body;
    if (!productId) {
        return res
            .status(400)
            .json({ message: errorMessage_1.WISHLIST_ERROR.PRODUCT_ID_REQUIRED });
    }
    try {
        // 위시리스트 상품 중복체크
        const existWish = yield prisma_1.default.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId: Number(productId),
                },
            },
        });
        if (existWish) {
            return res.status(409).json({ message: errorMessage_1.WISHLIST_ERROR.ALREADY_EXISTS });
        }
        // 위시리스트 상품 추가
        const newWishItem = yield prisma_1.default.wishlist.create({
            data: {
                userId,
                productId: Number(productId),
            },
        });
        return res.status(201).json({
            message: successMessage_1.WISHLIST_SUCCESS.ADD,
            wishlist: newWishItem,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.createWish = createWish;
// 위시리스트 조회
const getWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    try {
        const wishlist = yield prisma_1.default.wishlist.findMany({
            where: { userId },
            include: { product: true },
        });
        return res.status(200).json({
            message: successMessage_1.WISHLIST_SUCCESS.FETCH,
            wishlist,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.getWish = getWish;
// 위시리스트 삭제
const deleteWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: errorMessage_1.WISHLIST_ERROR.INVALID_PRODUCT });
    }
    try {
        const wish = yield prisma_1.default.wishlist.findUnique({
            where: { id },
        });
        if (!wish || wish.userId !== userId) {
            return res.status(403).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
        }
        const deletedWish = yield prisma_1.default.wishlist.delete({
            where: { id },
        });
        return res.status(200).json({
            message: successMessage_1.WISHLIST_SUCCESS.DELETE,
            wishlist: deletedWish,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.deleteWish = deleteWish;
