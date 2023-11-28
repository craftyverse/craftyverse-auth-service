import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";
import { logEvents } from "../middleware/log-events";
import {
  BadRequestError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";
import { UserService } from "../services/users";
import { userotpVerificationSchema } from "../schemas/otp-schema";

const verifyOTPHandler = asyncHandler(async (req: Request, res: Response) => {
  // Validating request data
  const userOtpRequest = userotpVerificationSchema.safeParse(req.body);

  if (!userOtpRequest.success) {
    logEvents(
      `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
        userOtpRequest.error.issues
      )}`,
      "error.txt"
    );
    throw new RequestValidationError(userOtpRequest.error.issues);
  }

  const user = userOtpRequest.data;

  // Checking for existing user in database
  const existingUser = await UserService.getUserByOtp(user.userOtp);

  if (!existingUser) {
    const methodName = "getUserByOtp";
    const message = "User does not exist. Please register.";
    logEvents(
      `${req.method}\t${req.headers.origin}\t${methodName}\t${message}`,
      "error.txt"
    );
    throw new BadRequestError(message);
  }

  res.sendStatus(200);
});

export { verifyOTPHandler };
