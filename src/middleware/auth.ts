import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Token not provided" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET not configured");
    return res.status(500).json({ msg: "Server configuration error" });
  }

  try {
    const verifyingToken = jwt.verify(token, secret) as JwtPayload;

    if (!verifyingToken) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    req.userId = verifyingToken.id as string;
    next();
    
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }
    return res.status(401).json({ msg: "Authentication failed" });
  }
};
