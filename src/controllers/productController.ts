import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      product_code,
      brand_id,
      price,
      stock_quantity,
      thumbnail_image_url,
      detail_description,
      is_sample,
      sample_price,
    } = req.body;

    if (!name || typeof price !== "number") {
      return res.status(400).json({
        message:
          "상품명(name)과 가격(price)은 필수이며, price는 숫자여야 합니다.",
      });
    }

    const newProduct = await prisma.products.create({
      data: {
        name,
        product_code,
        brand_id,
        price,
        stock_quantity,
        thumbnail_image_url,
        detail_description,
        is_sample,
        sample_price,
      },
    });

    console.log(newProduct);

    return res.status(201).json({
      message: "✅ 상품이 성공적으로 등록되었습니다.",
      products: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const findAllProduct = await prisma.products.findMany();

    console.log(findAllProduct);

    return res.status(200).json({
      message: "✅ 상품이 성공적으로 조회되었습니다.",
      products: findAllProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const getOneProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "상품 ID는 숫자여야 합니다." });
    }

    const findOneProduct = await prisma.products.findUnique({
      where: { id: id },
    });

    if (!findOneProduct) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    console.log(findOneProduct);

    return res.status(200).json({
      message: "✅ 상품이 성공적으로 조회되었습니다.",
      products: findOneProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
