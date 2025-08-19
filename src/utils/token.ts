import { JwtPayLoad } from "../types/userType";
import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: JwtPayLoad) => {
  const accessToken = jwt.sign(
    {
      id: payload.id,
      email: payload.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  return accessToken;
};

export const generateRefreshToken = (payload: JwtPayLoad) => {
  const refreshToken = jwt.sign(
    {
      id: payload.id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return refreshToken;
};
