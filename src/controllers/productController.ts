import { Request, RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import { COMMON_ERROR, PRODUCT_ERROR } from "../constants/errorMessage";
import { PRODUCT_SUCCESS } from "../constants/successMessage";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      productCode,
      brandId,
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
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        detailDescription,
        isSample,
        samplePrice,
        thumbnailImageUrl,
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

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const findAllProduct = await prisma.product.findMany();

    console.log(findAllProduct);

    return res.status(200).json({
      message: PRODUCT_SUCCESS.LIST,
      products: findAllProduct,
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
