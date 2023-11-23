import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { UserService } from "../../services/users";
import "dotenv/config";
import { NotAuthorisedError } from "@craftyverse-au/craftyverse-common";

const refreshTokenHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      console.log("error 1 :(");
      throw new NotAuthorisedError();
    }

    console.log("Cookie", cookies.jwt);
    const userRefreshToken = cookies.jwt;

    const foundUser = await UserService.getUserByRefreshToken(userRefreshToken);
    if (!foundUser) {
      console.log("error :(");
      throw new NotAuthorisedError();
    }
    console.log("refresh token", foundUser);

    jwt.verify(
      userRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err: any, user: any) => {
        if (err || foundUser._id.toString() !== user.userId) {
          return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
          {
            userId: user._id,
            userFirstName: user.userFirstName,
            userLastName: user.userLastName,
            userEmail: user.userEmail,
          },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: process.env.ACCESS_TOKEN_LIFE }
        );
        res.status(200).json({ accessToken: accessToken });
      }
    );
  }
);

export { refreshTokenHandler };
