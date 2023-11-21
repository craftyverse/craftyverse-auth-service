import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { registerUserSchema } from "../../schemas/register-user-schema";
import { User } from "../../models/user";
import { UserService } from "../../services/users";
import {
  RequestValidationError,
  ConflictError,
} from "@craftyverse-au/craftyverse-common";
import { logEvents, logger } from "../../middleware/log-events";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // Validating user data
  const authenticateUserData = registerUserSchema.safeParse(req.body);

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
    throw new ConflictError("User already exists.");
  }

  // Create new user
  UserService.createUser(user);

  res.status(200).json({
    message: "User created",
  });
});

export { registerUser };
