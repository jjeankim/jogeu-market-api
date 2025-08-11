import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError, ZodRawShape } from "zod";

export const validateBody = (schema: ZodObject<ZodRawShape>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return res
        .status(400)
        .json({ message: "입력값이 잘못되었습니다.", errors });
    }

    req.body = result.data;
    next();
  };
};
