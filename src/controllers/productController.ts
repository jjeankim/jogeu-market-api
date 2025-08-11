import { Request, RequestHandler, Response } from "express";
import { UserRequest } from "../types/expressUserRequest";
import prisma from "../lib/prisma";
import { COMMON_ERROR, PRODUCT_ERROR } from "../constants/errorMessage";
import { PRODUCT_SUCCESS } from "../constants/successMessage";
import { Prisma } from "@prisma/client";
import { UserRequest } from "../types/expressUserRequest";

const getBestProducts = async (limit: number = 4) => {
  const popularProductsWithCount = await prisma.$queryRaw<
    {
      id: number;
      salesCount: bigint;
    }[]
  >(Prisma.sql`
    SELECT p.id, COALESCE(SUM(oi.quantity), 0) AS "salesCount"
    FROM "Product" p
    LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
    GROUP BY p.id
    ORDER BY "salesCount" DESC
    LIMIT ${limit}
  `);

  const productIds = popularProductsWithCount.map((p) => p.id);
  const salesCountMap = new Map<number, string>(
    popularProductsWithCount.map((p) => [p.id, p.salesCount.toString()])
  );

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { brand: true, category: true },
  });

  const result = products.map((product) => ({
    ...product,
    salesCount: salesCountMap.get(product.id) ?? "0",
  }));

  return result;
};

const getNewProducts = async (limit: number) => {
  const newProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { brand: true, category: true },
  });

  return newProducts;
};

const getBrandProductsByCategory = async (limit: number) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
  });

  const brandProducts = await Promise.all(
    categories.map(async (category) => {
      const products = await prisma.product.findMany({
        where: { categoryId: category.id },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { brand: true, category: true },
      });

      return {
        category: category.slug,
        products,
      };
    })
  );

  return brandProducts.filter((item) => item.products.length > 0);
};

const getPickProducts = async (limit: number) => {
  const pickProducts = await prisma.product.findMany({
    where: { isPick: true },
    take: limit,
    include: { brand: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return pickProducts;
};

export const getLandingProducts = async (req: Request, res: Response) => {
  try {
    const {
      pickLimit = "5",
      newLimit = "10",
      brandLimit = "5",
      bestLimit = "10",
    } = req.query;

    const pickLimitNum = Number(pickLimit);
    const newLimitNum = Number(newLimit);
    const brandLimitNum = Number(brandLimit);
    const bestLimitNum = Number(bestLimit);

    const safePickLimit =
      isNaN(pickLimitNum) || pickLimitNum < 1 ? 4 : pickLimitNum;
    const safeNewLimit =
      isNaN(newLimitNum) || newLimitNum < 1 ? 5 : newLimitNum;
    const safeBrandLimit =
      isNaN(brandLimitNum) || brandLimitNum < 1 ? 3 : brandLimitNum;
    const safeBestLimit =
      isNaN(bestLimitNum) || bestLimitNum < 1 ? 4 : bestLimitNum;

    const bestProducts = await getBestProducts(safeBestLimit);
    const newProducts = await getNewProducts(safeNewLimit);
    const pickProducts = await getPickProducts(safePickLimit);
    const brandProducts = await getBrandProductsByCategory(safeBrandLimit);

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: COMMON_ERROR.UNAUTHORIZED });
  }

  try {
    const {
      name,
      productCode,
      brandId,
      categoryId,
      price,
      stockQuantity,
      detailDescription,
      isSample,
      samplePrice,
    } = req.body;

    if (!name || isNaN(Number(price))) {
      return res.status(400).json({
        message: PRODUCT_ERROR.VALIDATION,
      });
    }

    // Azure 업로드 결과 가져오기
    const files = req.files as {
      thumbnail?: (Express.Multer.File & { url?: string })[];
      detailImage?: (Express.Multer.File & { url?: string })[];
    };

    const thumbnailImageUrl = files?.thumbnail?.[0]
      ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${
          process.env.AZURE_STORAGE_CONTAINER
        }/${(files.thumbnail[0] as any).blobName}`
      : null;

    const detailImageUrl = files?.detailImage?.[0]
      ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${
          process.env.AZURE_STORAGE_CONTAINER
        }/${(files.detailImage[0] as any).blobName}`
      : "";
    // if (!req.file) {
    //   return res
    //     .status(400)
    //     .json({ message: PRODUCT_ERROR.THUMBNAIL_REQUIRED });
    // }
    if (!thumbnailImageUrl) {
      return res
        .status(400)
        .json({ message: PRODUCT_ERROR.THUMBNAIL_REQUIRED });
    }

    // const thumbnailImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    //   req.file.filename
    // }`;

    const newProduct = await prisma.product.create({
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
      message: PRODUCT_SUCCESS.CREATE,
      products: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

type PopularProduct = {
  id: number;
  name: string;
  productCode: string;
  brandId: number;
  categoryId: number;
  price: number;
  stockQuantity: number;
  thumbnailImageUrl: string;
  detailImageUrl: string;
  detailDescription: string | null;
  isSample: boolean;
  samplePrice: number | null;
  createdAt: Date;
  updatedAt: Date;
  purchaseCount: bigint; // 쿼리에서 COALESCE SUM 결과가 bigint
};

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const {
      category,
      productCode,
      page = "1",
      limit = "10",
      sort = "latest",
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res.status(400).json({ message: PRODUCT_ERROR.VALIDATION });
    }

    // 인기순일 때 raw query로 처리
    if (sort === "popularity") {
      const offset = (pageNumber - 1) * limitNumber;

      // 인기순 id만 조회
      const popularIdsWithCount = await prisma.$queryRaw<
        { id: number; purchaseCount: bigint }[]
      >(Prisma.sql`
  SELECT p.id, COALESCE(SUM(oi.quantity), 0) AS "purchaseCount"
  FROM "Product" p
  LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
  WHERE
    (
      ${
        category === "all" ? Prisma.sql`NULL` : Prisma.sql`${category}`
      }::text IS NULL 
      OR p."categoryId" = (
        SELECT id FROM "Category" WHERE slug = ${
          category === "all" ? Prisma.sql`NULL` : Prisma.sql`${category}`
        }
      )
    )
    AND (
      ${
        productCode ? Prisma.sql`${productCode}` : Prisma.sql`NULL`
      }::text IS NULL 
      OR p."productCode" LIKE (${
        productCode ? Prisma.sql`${productCode}` : Prisma.sql`NULL`
      } || '%')
    )
  GROUP BY p.id
  ORDER BY "purchaseCount" DESC
  LIMIT ${limitNumber} OFFSET ${offset}
`);

      // 인기순 id 배열과 purchaseCount 문자열 변환
      const popularIds = popularIdsWithCount.map((p) => p.id);
      const purchaseCountsMap = new Map<number, string>(
        popularIdsWithCount.map((p) => [p.id, p.purchaseCount.toString()])
      );

      // 실제 인기순 상품 조회 (brand, category 포함)
      const popularProducts = await prisma.product.findMany({
        where: { id: { in: popularIds } },
        include: { brand: true, category: true },
      });

      // purchaseCount 필드 추가 (api response용)
      const productsWithPurchaseCount = popularProducts.map((product) => ({
        ...product,
        purchaseCount: purchaseCountsMap.get(product.id) ?? "0",
      }));

      // totalCount 구하기
      const totalCount = await prisma.product.count({
        where: {
          ...(category && category !== "all"
            ? { category: { slug: category as string } }
            : {}),
          ...(productCode
            ? { productCode: { startsWith: productCode as string } }
            : {}),
        },
      });

      return res.status(200).json({
        message: PRODUCT_SUCCESS.LIST,
        products: productsWithPurchaseCount,
        totalCount,
      });
    }

    // 인기순이 아니면 기존 방식
    let whereClause: Prisma.ProductWhereInput = {};
    if (category && category !== "all") {
      whereClause.category = { slug: category as string };
    }
    if (productCode && typeof productCode === "string") {
      whereClause.productCode = { startsWith: productCode };
    }

    let orderByClause: Prisma.ProductOrderByWithRelationInput = {};
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

    const totalCount = await prisma.product.count({ where: whereClause });

    const findAllProduct = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: { brand: true, category: true },
    });

    return res.status(200).json({
      message: PRODUCT_SUCCESS.LIST,
      products: findAllProduct,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const getOneProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: PRODUCT_ERROR.ITEM_VALIDATION });
    }

    const findOneProduct = await prisma.product.findUnique({
      where: { id: id },
      include: {
        brand: true,
        category: true,
      },
    });

    if (!findOneProduct) {
      return res.status(404).json({ message: PRODUCT_ERROR.NOT_FOUND });
    }

    console.log(findOneProduct);

    return res.status(200).json({
      message: PRODUCT_SUCCESS.LIST,
      products: findOneProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const getSearchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: PRODUCT_ERROR.VALIDATION });
    }

    const searchProducts = await prisma.product.findMany({
      where: {
        name: { contains: query as string, mode: "insensitive" },
      },
      include: {
        brand: true,
        category: true,
      },
    });

    return res.status(200).json({
      message: PRODUCT_SUCCESS.LIST,
      products: searchProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};


export const createProductQnA = async (req: UserRequest, res: Response) => {
  try {
    const { question } = req.body;

    const productId = Number(req.params.id);
    const userId = Number(req.user!.id);

    const newProductQnA = await prisma.productQnA.create({
      data: {
        productId: productId,
        userId: userId,
        question: question,
      },
    });

    return res.status(201).json({
      message: PRODUCT_SUCCESS.CREATE,
      productQnA: newProductQnA,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const getProductQnA = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const productQnA = await prisma.productQnA.findMany({
      where: { productId: productId },
     
    });

    return res.status(200).json({
      message: PRODUCT_SUCCESS.LIST,
      productQnA: productQnA,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

export const fetchProductAnswers = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const qnaId = Number(req.params.qnaId);
    const { answer } = req.body as { answer: string };

    if (!answer || !answer.trim()) {
      return res.status(400).json({ message: PRODUCT_ERROR.VALIDATION || "유효하지 않은 요청입니다." });
    }

    // 존재/소유 상품 확인
    const qna = await prisma.productQnA.findFirst({
      where: { id: qnaId, productId },
      select: { id: true },
    });
    if (!qna) {
      return res.status(404).json({ message: PRODUCT_ERROR.NOT_FOUND || "문의가 없습니다." });
    }

    const updated = await prisma.productQnA.update({
      where: { id: qnaId },
      data: {
        answer,
        status: "ANSWERED",
        answeredAt: new Date(),
      },
    });

    return res.status(200).json({ message: "답변이 저장되었습니다.", data: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};