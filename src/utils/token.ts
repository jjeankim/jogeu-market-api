import { User } from "../types/userType";
import jwt from "jsonwebtoken";

const generateToken = (user: User) => {
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

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

export default generateToken;
