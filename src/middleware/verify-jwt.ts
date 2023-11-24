import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { NotAuthorisedError } from "@craftyverse-au/craftyverse-common";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userFirstName: string;
      userLastName: string;
      userEmail: string;
      userRoles: string[];
    }
  }
}
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!Array.isArray(authHeader) && !authHeader?.startsWith("Bearer ")) {
    throw new NotAuthorisedError();
  }

  const token = Array.isArray(authHeader)
    ? authHeader[0].split(" ")[1]
    : authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    console.log(user);
    req.userId = (user as JwtPayload).userId;
    req.userFirstName = (user as JwtPayload).userFirstName;
    req.userLastName = (user as JwtPayload).userLastName;
    req.userEmail = (user as JwtPayload).userEmail;
    req.userRoles = (user as JwtPayload).userRoles;
    next();
  });
};

export { verifyJWT };
