import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types/expressUserRequest";

export const authenticateJWT = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.sendStatus(401).json({ message: "토큰이 없습니다." });

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(404).json({ message: "토큰이 없습니다." });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err)
      // return res.sendStatus(403).json({ message: "유효하지 않은 토큰입니다." });
      return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    req.user = user as UserRequest["user"];
    next();
  });
};
