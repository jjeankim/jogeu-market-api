import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { BRAND_ERROR, COMMON_ERROR } from "../constants/errorMessage";
import { BRAND_SUCCESS } from "../constants/successMessage";

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: BRAND_ERROR.VALIDATION,
      });
    }

    // 로고 이미지 URL 처리
    const logoImageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    const newBrand = await prisma.brand.create({
      data: {
        name,
        logoImageUrl,
      },
    });

    console.log(newBrand);

    return res.status(201).json({
      message: BRAND_SUCCESS.CREATE,
      products: newBrand,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};

// export const getAllBrand = async (req: Request, res: Response) => {
//   try {
//     const findAllBrand = await prisma.brand.findMany();

//     console.log(findAllBrand);

//     return res.status(200).json({
//       message: BRAND_SUCCESS.FETCH,
//       products: findAllBrand,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
//   }
// };

// export const getAllBrand = async (req: Request, res: Response) => {
//   try {
//     const { categorySlug, subCategoryPrefix } = req.query;

//     let whereClause = {};

//     if (subCategoryPrefix && typeof subCategoryPrefix === "string") {
//       // productCode prefix 기준 필터링 (서브카테고리)
//       whereClause = {
//         products: {
//           some: {
//             productCode: {
//               startsWith: subCategoryPrefix,
//             },
//           },
//         },
//       };
//     } else if (categorySlug && typeof categorySlug === "string") {
//       // categorySlug 기준 필터링 (대분류 카테고리)
//       // category slug가 유효한지 체크 후
//       const category = await prisma.category.findUnique({
//         where: { slug: categorySlug },
//       });

//       if (!category) {
//         return res.status(404).json({ message: "Category not found" });
//       }

//       whereClause = {
//         products: {
//           some: {
//             categoryId: category.id,
//           },
//         },
//       };
//     } else {
//       // 필터링 없으면 전체 브랜드 조회
//       whereClause = {};
//     }

//     const brands = await prisma.brand.findMany({
//       where: whereClause,
//       distinct: ["id"],
//       select: {
//         id: true,
//         name: true,
//         logoImageUrl: true,
//       },
//     });

//     return res.status(200).json({
//       message: "Brands fetched successfully",
//       brands,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export const getAllBrand = async (req: Request, res: Response) => {
  try {
    const { categorySlug, subCategoryPrefix } = req.query;

    let whereClause = {};

    // 서브카테고리 (productCode prefix)
    if (subCategoryPrefix && typeof subCategoryPrefix === "string") {
      whereClause = {
        products: {
          some: {
            productCode: {
              startsWith: subCategoryPrefix,
            },
          },
        },
      };
    }
    //  대분류
    else if (categorySlug && typeof categorySlug === "string") {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (!category) {
        return res.status(404).json({
          message: BRAND_ERROR.CATEGORY_NOT_FOUND || "Category not found",
        });
      }

      whereClause = {
        products: {
          some: {
            categoryId: category.id,
          },
        },
      };
    }

    const brands = await prisma.brand.findMany({
      where: whereClause,
      distinct: ["id"],
      select: {
        id: true,
        name: true,
        logoImageUrl: true,
      },
    });

    return res.status(200).json({
      message: BRAND_SUCCESS.FETCH,
      brands,
    });
  } catch (error) {
    console.error("Error in getAllBrand:", error);
    return res.status(500).json({ message: COMMON_ERROR.SERVER_ERROR });
  }
};
