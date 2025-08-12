import { User } from "../types/userType";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: User) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  return accessToken;
};

export const generateRefreshToken = (user: User) => {
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return refreshToken
};
