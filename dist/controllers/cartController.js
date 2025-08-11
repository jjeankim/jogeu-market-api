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
exports.mergeDuplicateCartItems = exports.deleteCart = exports.patchCart = exports.getCart = exports.createCart = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorMessage_1 = require("../constants/errorMessage");
const successMessage_1 = require("../constants/successMessage");
const createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    try {
        const { productId, quantity } = req.body;
        // 기존에 같은 상품이 장바구니에 있는지 확인하고 처리
        const existingCartItem = yield prisma_1.default.cart.findFirst({
            where: {
                userId,
                productId,
            },
        });
        let cartItem;
        if (existingCartItem) {
            // 기존 아이템이 있으면 수량을 더함
            cartItem = yield prisma_1.default.cart.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity },
            });
            console.log("기존 장바구니 아이템 수량 업데이트:", cartItem);
        }
        else {
            // 기존 아이템이 없으면 새로 생성
            cartItem = yield prisma_1.default.cart.create({
                data: {
                    userId,
                    productId,
                    quantity,
                },
            });
            console.log("새 장바구니 아이템 생성:", cartItem);
        }
        return res.status(201).json({
            message: successMessage_1.CART_SUCCESS.ADD,
            carts: cartItem,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.createCart = createCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    try {
        const findCart = yield prisma_1.default.cart.findMany({
            where: { userId },
            include: { product: true },
        });
        console.log(findCart);
        return res.status(200).json({
            message: successMessage_1.CART_SUCCESS.ADD,
            carts: findCart,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.getCart = getCart;
const patchCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { quantity } = req.body;
        const patchCart = yield prisma_1.default.cart.update({
            where: { id },
            data: { quantity },
        });
        console.log(patchCart);
        return res.status(200).json({
            message: successMessage_1.CART_SUCCESS.UPDATE,
            products: patchCart,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.patchCart = patchCart;
const deleteCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleteCart = yield prisma_1.default.cart.delete({
            where: { id },
        });
        console.log(deleteCart);
        return res.status(200).json({
            message: successMessage_1.CART_SUCCESS.DELETE,
            products: deleteCart,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.deleteCart = deleteCart;
// 중복된 장바구니 아이템들을 정리하는 함수
const mergeDuplicateCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    try {
        // 사용자의 모든 장바구니 아이템을 productId별로 그룹화
        const cartItems = yield prisma_1.default.cart.findMany({
            where: { userId },
            orderBy: { id: 'asc' }, // 가장 오래된 것을 기준으로
        });
        // productId별로 그룹화
        const groupedItems = cartItems.reduce((acc, item) => {
            if (!acc[item.productId]) {
                acc[item.productId] = [];
            }
            acc[item.productId].push(item);
            return acc;
        }, {});
        let mergedCount = 0;
        // 각 productId별로 중복 제거
        for (const [productId, items] of Object.entries(groupedItems)) {
            if (items.length > 1) {
                // 총 수량 계산
                const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
                // 첫 번째 아이템 유지하고 수량 업데이트
                const keepItem = items[0];
                yield prisma_1.default.cart.update({
                    where: { id: keepItem.id },
                    data: { quantity: totalQuantity },
                });
                // 나머지 아이템들 삭제
                const idsToDelete = items.slice(1).map(item => item.id);
                yield prisma_1.default.cart.deleteMany({
                    where: { id: { in: idsToDelete } },
                });
                mergedCount += items.length - 1;
                console.log(`상품 ${productId}: ${items.length}개 아이템을 1개로 통합 (총 수량: ${totalQuantity})`);
            }
        }
        return res.status(200).json({
            message: `중복된 장바구니 아이템 ${mergedCount}개를 정리했습니다.`,
            mergedCount,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.mergeDuplicateCartItems = mergeDuplicateCartItems;
