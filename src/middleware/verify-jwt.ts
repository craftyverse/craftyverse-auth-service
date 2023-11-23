import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { NotAuthorisedError } from "@craftyverse-au/craftyverse-common";

interface UserPayload {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new NotAuthorisedError();
  }

  console.log("Auth header", authHeader); // Bearer <token>

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    console.log(user);
    req.currentUser = user as UserPayload;
    next();
  });
};

export { verifyJWT };
