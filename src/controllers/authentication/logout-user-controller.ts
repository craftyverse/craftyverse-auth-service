import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { UserService } from "../../services/users";
import "dotenv/config";
import {
  NotAuthorisedError,
  NotFoundError,
} from "@craftyverse-au/craftyverse-common";

const logoutHandler = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    console.log("Error: JWT cookie not found");
    throw new NotFoundError("JWT cookie not found");
  }

  const userRefreshToken = cookies.jwt;
  console.log(userRefreshToken);

  // is refreshToken valid?
  const foundUser = await UserService.getUserByRefreshToken(userRefreshToken);
  if (!foundUser) {
    console.log("Error: User not found");
    throw new NotFoundError("User not found");
  }

  console.log("Refresh token", foundUser);

  // delete refreshToken from user
  const loggedOutUser = await UserService.deleteRefreshTokenByUser(
    userRefreshToken
  );

  console.log(loggedOutUser);

  // clear refreshToken cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure:
      process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test",
  });

  res.status(200).json({ message: "User logged out" });
});

export { logoutHandler };
