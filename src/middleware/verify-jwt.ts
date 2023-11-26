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
      userRoles: number[];
    }
  }
}
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  console.log("This is the auth header: ", authHeader);

  if (!authHeader) {
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
    req.userId = (user as JwtPayload).UserInfo.userId;
    req.userFirstName = (user as JwtPayload).UserInfo.userFirstName;
    req.userLastName = (user as JwtPayload).UserInfo.userLastName;
    req.userEmail = (user as JwtPayload).UserInfo.userEmail;
    req.userRoles = (user as JwtPayload).UserInfo.userRoles;
    next();
  });
};

export { verifyJWT };
