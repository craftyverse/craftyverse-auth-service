import { Request, Response, NextFunction } from "express";
import { allowedOrigins } from "../../config/allowed-origins";
import { NotAuthorisedError } from "@craftyverse-au/craftyverse-common";

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (!origin) {
    throw new NotAuthorisedError();
  }
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
};
