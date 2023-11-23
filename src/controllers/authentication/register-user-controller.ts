import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import {
  registerUserRequestSchema,
  RegisterUserResponse,
} from "../../schemas/register-user-schema";
import { UserService } from "../../services/users";
import {
  RequestValidationError,
  ConflictError,
} from "@craftyverse-au/craftyverse-common";
import { logEvents } from "../../middleware/log-events";

const registerUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // Validating user data
    const authenticateUserData = registerUserRequestSchema.safeParse(req.body);

    if (!authenticateUserData.success) {
      console.log(authenticateUserData.error.issues);
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
          authenticateUserData.error.issues
        )}`,
        "error.txt"
      );
      throw new RequestValidationError(authenticateUserData.error.issues);
    }

    const user = authenticateUserData.data;

    // Checking for existing user in database
    const existingUser = await UserService.getUserByEmail(user.userEmail);

    if (existingUser) {
      const methodName = "getUserByEmail";
      const message = "User already exists.";
      logEvents(
        `${req.method}\t${req.headers.origin}\t${methodName}\t${message}`,
        "error.txt"
      );
      throw new ConflictError(message);
    }

    // Generate JWT
    const accessToken = jwt.sign(
      {
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        userEmail: user.userEmail,
      },
      process.env.ACCESS_TOKEN_SECRET
        ? process.env.ACCESS_TOKEN_SECRET
        : "secret",
      { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      {
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        userEmail: user.userEmail,
      },
      process.env.REFRESH_TOKEN_SECRET
        ? process.env.REFRESH_TOKEN_SECRET
        : "secret",
      { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    );

    // Create new user
    const createdUser = await UserService.createUser(user, refreshToken);

    const createdUserResponse: RegisterUserResponse = {
      userAccessToken: accessToken,
    };

    res.status(200).json(createdUserResponse);
  }
);

export { registerUserHandler };
