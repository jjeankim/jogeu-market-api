import { Request, RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import { COMMON_ERROR, PRODUCT_ERROR } from "../constants/errorMessage";
import { PRODUCT_SUCCESS } from "../constants/successMessage";
import { Prisma } from "@prisma/client";

export const createProduct = async (req: Request, res: Response) => {
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

    if (!req.file) {
      return res
        .status(400)
        .json({ message: PRODUCT_ERROR.THUMBNAIL_REQUIRED });
    }

    const thumbnailImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const newProduct = await prisma.product.create({
      data: {
        name,
        productCode,
        brandId: Number(brandId),
        categoryId: Number(categoryId),
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        thumbnailImageUrl,
        detailImageUrl: "", // 빈 문자열로 설정
        detailDescription,
        isSample,
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

// export const getAllProduct = async (req: Request, res: Response) => {
//   try {
//     // 정렬기준, page 당 보여줄 부분 수정 해야함
//     const { category, productCode } = req.query;

//     let whereClause: Prisma.ProductWhereInput = {};

//     // 카테고리 필터링
//     if (category && category !== "all") {
//       whereClause = {
//         category: {
//           slug: category as string,
//         },
//       };
//     }

//     if (productCode && typeof productCode === "string") {
//       whereClause.productCode = {
//         startsWith: productCode,
//       };
//     }

//     const findAllProduct = await prisma.product.findMany({
//       where: whereClause,
//       include: {
//         brand: true,
//         category: true,
//       },
//     });

//     console.log(findAllProduct);

//     return res.status(200).json({
//       message: PRODUCT_SUCCESS.LIST,
//       products: findAllProduct,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
//   }
// };

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

      // const popularProductsRaw = await prisma.$queryRaw<PopularProduct[]>(
      //   Prisma.sql`
      //     SELECT p.*, COALESCE(SUM(oi.quantity), 0) AS "purchaseCount"
      //     FROM "Product" p
      //     LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
      //     WHERE
      //       (
      //         ${
      //           category === "all" ? Prisma.sql`NULL` : Prisma.sql`${category}`
      //         }::text IS NULL
      //         OR p."categoryId" = (
      //           SELECT id FROM "Category" WHERE slug = ${
      //             category === "all"
      //               ? Prisma.sql`NULL`
      //               : Prisma.sql`${category}`
      //           }
      //         )
      //       )
      //       AND (
      //         ${
      //           productCode ? Prisma.sql`${productCode}` : Prisma.sql`NULL`
      //         }::text IS NULL
      //         OR p."productCode" LIKE (${
      //           productCode ? Prisma.sql`${productCode}` : Prisma.sql`NULL`
      //         } || '%')
      //       )
      //     GROUP BY p.id
      //     ORDER BY "purchaseCount" DESC
      //     LIMIT ${limitNumber} OFFSET ${offset}
      //   `
      // );
      // // BigInt 필드를 string으로 변환
      // const popularProducts = popularProductsRaw.map((product) => ({
      //   ...product,
      //   purchaseCount: product.purchaseCount.toString(),
      // }));

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
