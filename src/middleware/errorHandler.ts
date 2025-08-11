import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, _next: any) => {
  const status = err.status ?? 500;
  const message = err.message ?? "Server Error";
  if (process.env.NODE_ENV !== "production") console.error(err);
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};