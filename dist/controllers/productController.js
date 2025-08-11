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
exports.fetchProductAnswers = exports.getProductQnA = exports.createProductQnA = exports.getSearchProducts = exports.getOneProduct = exports.getAllProduct = exports.createProduct = exports.getLandingProducts = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorMessage_1 = require("../constants/errorMessage");
const successMessage_1 = require("../constants/successMessage");
const client_1 = require("@prisma/client");
const getBestProducts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 4) {
    const popularProductsWithCount = yield prisma_1.default.$queryRaw(client_1.Prisma.sql `
    SELECT p.id, COALESCE(SUM(oi.quantity), 0) AS "salesCount"
    FROM "Product" p
    LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
    GROUP BY p.id
    ORDER BY "salesCount" DESC
    LIMIT ${limit}
  `);
    const productIds = popularProductsWithCount.map((p) => p.id);
    const salesCountMap = new Map(popularProductsWithCount.map((p) => [p.id, p.salesCount.toString()]));
    const products = yield prisma_1.default.product.findMany({
        where: { id: { in: productIds } },
        include: { brand: true, category: true },
    });
    const result = products.map((product) => {
        var _a;
        return (Object.assign(Object.assign({}, product), { salesCount: (_a = salesCountMap.get(product.id)) !== null && _a !== void 0 ? _a : "0" }));
    });
    return result;
});
const getNewProducts = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    const newProducts = yield prisma_1.default.product.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { brand: true, category: true },
    });
    return newProducts;
});
const getBrandProductsByCategory = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
    });
    const brandProducts = yield Promise.all(categories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield prisma_1.default.product.findMany({
            where: { categoryId: category.id },
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { brand: true, category: true },
        });
        return {
            category: category.slug,
            products,
        };
    })));
    return brandProducts.filter((item) => item.products.length > 0);
});
const getPickProducts = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    const pickProducts = yield prisma_1.default.product.findMany({
        where: { isPick: true },
        take: limit,
        include: { brand: true, category: true },
        orderBy: { createdAt: "desc" },
    });
    return pickProducts;
});
const getLandingProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pickLimit = "5", newLimit = "10", brandLimit = "5", bestLimit = "10", } = req.query;
        const pickLimitNum = Number(pickLimit);
        const newLimitNum = Number(newLimit);
        const brandLimitNum = Number(brandLimit);
        const bestLimitNum = Number(bestLimit);
        const safePickLimit = isNaN(pickLimitNum) || pickLimitNum < 1 ? 4 : pickLimitNum;
        const safeNewLimit = isNaN(newLimitNum) || newLimitNum < 1 ? 5 : newLimitNum;
        const safeBrandLimit = isNaN(brandLimitNum) || brandLimitNum < 1 ? 3 : brandLimitNum;
        const safeBestLimit = isNaN(bestLimitNum) || bestLimitNum < 1 ? 4 : bestLimitNum;
        const bestProducts = yield getBestProducts(safeBestLimit);
        const newProducts = yield getNewProducts(safeNewLimit);
        const pickProducts = yield getPickProducts(safePickLimit);
        const brandProducts = yield getBrandProductsByCategory(safeBrandLimit);
        //     return res.status(200).json({
        //       message: "Landing products fetched successfully",
        //       best: bestProducts,
        //       brand: brandProducts,
        //       pick: picKProducts,
        //       new: newProducts,
        //     });
        //   } catch (error) {
        //     console.error(error);
        //     return res.status(500).json({ message: "Server error" });
        //   }
        // };
        return res.status(200).json({
            message: "Landing products fetched successfully",
            best: bestProducts,
            brand: brandProducts,
            pick: pickProducts,
            new: newProducts,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getLandingProducts = getLandingProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: errorMessage_1.COMMON_ERROR.UNAUTHORIZED });
    }
    try {
        const { name, productCode, brandId, categoryId, price, stockQuantity, detailDescription, isSample, samplePrice, } = req.body;
        if (!name || isNaN(Number(price))) {
            return res.status(400).json({
                message: errorMessage_1.PRODUCT_ERROR.VALIDATION,
            });
        }
        // Azure 업로드 결과 가져오기
        const files = req.files;
        const thumbnailImageUrl = ((_b = files === null || files === void 0 ? void 0 : files.thumbnail) === null || _b === void 0 ? void 0 : _b[0])
            ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER}/${files.thumbnail[0].blobName}`
            : null;
        const detailImageUrl = ((_c = files === null || files === void 0 ? void 0 : files.detailImage) === null || _c === void 0 ? void 0 : _c[0])
            ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER}/${files.detailImage[0].blobName}`
            : "";
        // if (!req.file) {
        //   return res
        //     .status(400)
        //     .json({ message: PRODUCT_ERROR.THUMBNAIL_REQUIRED });
        // }
        if (!thumbnailImageUrl) {
            return res
                .status(400)
                .json({ message: errorMessage_1.PRODUCT_ERROR.THUMBNAIL_REQUIRED });
        }
        // const thumbnailImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        //   req.file.filename
        // }`;
        const newProduct = yield prisma_1.default.product.create({
            data: {
                name,
                productCode,
                brandId: Number(brandId),
                categoryId: Number(categoryId),
                price: Number(price),
                stockQuantity: Number(stockQuantity),
                thumbnailImageUrl,
                detailImageUrl,
                detailDescription,
                isSample: isSample === "true",
                samplePrice: samplePrice ? Number(samplePrice) : null,
            },
        });
        console.log(newProduct);
        return res.status(201).json({
            message: successMessage_1.PRODUCT_SUCCESS.CREATE,
            products: newProduct,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.createProduct = createProduct;
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, productCode, page = "1", limit = "10", sort = "latest", } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        if (isNaN(pageNumber) ||
            isNaN(limitNumber) ||
            pageNumber < 1 ||
            limitNumber < 1) {
            return res.status(400).json({ message: errorMessage_1.PRODUCT_ERROR.VALIDATION });
        }
        // 인기순일 때 raw query로 처리
        if (sort === "popularity") {
            const offset = (pageNumber - 1) * limitNumber;
            // 인기순 id만 조회
            const popularIdsWithCount = yield prisma_1.default.$queryRaw(client_1.Prisma.sql `
  SELECT p.id, COALESCE(SUM(oi.quantity), 0) AS "purchaseCount"
  FROM "Product" p
  LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
  WHERE
    (
      ${category === "all" ? client_1.Prisma.sql `NULL` : client_1.Prisma.sql `${category}`}::text IS NULL 
      OR p."categoryId" = (
        SELECT id FROM "Category" WHERE slug = ${category === "all" ? client_1.Prisma.sql `NULL` : client_1.Prisma.sql `${category}`}
      )
    )
    AND (
      ${productCode ? client_1.Prisma.sql `${productCode}` : client_1.Prisma.sql `NULL`}::text IS NULL 
      OR p."productCode" LIKE (${productCode ? client_1.Prisma.sql `${productCode}` : client_1.Prisma.sql `NULL`} || '%')
    )
  GROUP BY p.id
  ORDER BY "purchaseCount" DESC
  LIMIT ${limitNumber} OFFSET ${offset}
`);
            // 인기순 id 배열과 purchaseCount 문자열 변환
            const popularIds = popularIdsWithCount.map((p) => p.id);
            const purchaseCountsMap = new Map(popularIdsWithCount.map((p) => [p.id, p.purchaseCount.toString()]));
            // 실제 인기순 상품 조회 (brand, category 포함)
            const popularProducts = yield prisma_1.default.product.findMany({
                where: { id: { in: popularIds } },
                include: { brand: true, category: true },
            });
            // purchaseCount 필드 추가 (api response용)
            const productsWithPurchaseCount = popularProducts.map((product) => {
                var _a;
                return (Object.assign(Object.assign({}, product), { purchaseCount: (_a = purchaseCountsMap.get(product.id)) !== null && _a !== void 0 ? _a : "0" }));
            });
            // totalCount 구하기
            const totalCount = yield prisma_1.default.product.count({
                where: Object.assign(Object.assign({}, (category && category !== "all"
                    ? { category: { slug: category } }
                    : {})), (productCode
                    ? { productCode: { startsWith: productCode } }
                    : {})),
            });
            return res.status(200).json({
                message: successMessage_1.PRODUCT_SUCCESS.LIST,
                products: productsWithPurchaseCount,
                totalCount,
            });
        }
        // 인기순이 아니면 기존 방식
        let whereClause = {};
        if (category && category !== "all") {
            whereClause.category = { slug: category };
        }
        if (productCode && typeof productCode === "string") {
            whereClause.productCode = { startsWith: productCode };
        }
        let orderByClause = {};
        switch (sort) {
            case "latest":
                orderByClause = { id: "desc" };
                break;
            case "lowPrice":
                orderByClause = { price: "asc" };
                break;
            case "highPrice":
                orderByClause = { price: "desc" };
                break;
            default:
                orderByClause = { id: "desc" };
        }
        const totalCount = yield prisma_1.default.product.count({ where: whereClause });
        const findAllProduct = yield prisma_1.default.product.findMany({
            where: whereClause,
            orderBy: orderByClause,
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
            include: { brand: true, category: true },
        });
        return res.status(200).json({
            message: successMessage_1.PRODUCT_SUCCESS.LIST,
            products: findAllProduct,
            totalCount,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.getAllProduct = getAllProduct;
const getOneProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: errorMessage_1.PRODUCT_ERROR.ITEM_VALIDATION });
        }
        const findOneProduct = yield prisma_1.default.product.findUnique({
            where: { id: id },
            include: {
                brand: true,
                category: true,
            },
        });
        if (!findOneProduct) {
            return res.status(404).json({ message: errorMessage_1.PRODUCT_ERROR.NOT_FOUND });
        }
        console.log(findOneProduct);
        return res.status(200).json({
            message: successMessage_1.PRODUCT_SUCCESS.LIST,
            products: findOneProduct,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.getOneProduct = getOneProduct;
const getSearchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: errorMessage_1.PRODUCT_ERROR.VALIDATION });
        }
        const searchProducts = yield prisma_1.default.product.findMany({
            where: {
                name: { contains: query, mode: "insensitive" },
            },
            include: {
                brand: true,
                category: true,
            },
        });
        return res.status(200).json({
            message: successMessage_1.PRODUCT_SUCCESS.LIST,
            products: searchProducts,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.getSearchProducts = getSearchProducts;
const createProductQnA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question } = req.body;
        const productId = Number(req.params.id);
        const userId = Number(req.user.id);
        const newProductQnA = yield prisma_1.default.productQnA.create({
            data: {
                productId: productId,
                userId: userId,
                question: question,
            },
        });
        return res.status(201).json({
            message: successMessage_1.PRODUCT_SUCCESS.CREATE,
            productQnA: newProductQnA,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.createProductQnA = createProductQnA;
const getProductQnA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = Number(req.params.id);
        const productQnA = yield prisma_1.default.productQnA.findMany({
            where: { productId: productId },
        });
        return res.status(200).json({
            message: successMessage_1.PRODUCT_SUCCESS.LIST,
            productQnA: productQnA,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.getProductQnA = getProductQnA;
const fetchProductAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = Number(req.params.id);
        const qnaId = Number(req.params.qnaId);
        const { answer } = req.body;
        if (!answer || !answer.trim()) {
            return res.status(400).json({ message: errorMessage_1.PRODUCT_ERROR.VALIDATION || "유효하지 않은 요청입니다." });
        }
        // 존재/소유 상품 확인
        const qna = yield prisma_1.default.productQnA.findFirst({
            where: { id: qnaId, productId },
            select: { id: true },
        });
        if (!qna) {
            return res.status(404).json({ message: errorMessage_1.PRODUCT_ERROR.NOT_FOUND || "문의가 없습니다." });
        }
        const updated = yield prisma_1.default.productQnA.update({
            where: { id: qnaId },
            data: {
                answer,
                status: "ANSWERED",
                answeredAt: new Date(),
            },
        });
        return res.status(200).json({ message: "답변이 저장되었습니다.", data: updated });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessage_1.COMMON_ERROR.SERVER_ERROR });
    }
});
exports.fetchProductAnswers = fetchProductAnswers;
