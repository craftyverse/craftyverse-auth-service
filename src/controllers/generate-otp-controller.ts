import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/user";
import { userOtpRequestSchema, userOtp } from "../schemas/otp-schema";
import { logEvents } from "../middleware/log-events";
import { RequestValidationError } from "@craftyverse-au/craftyverse-common";

const generateOTPHandler = asyncHandler(async (req: Request, res: Response) => {
  // validating OTP request data
  const userOtpRequestData = userOtpRequestSchema.safeParse(req.body);

  if (!userOtpRequestData.success) {
    logEvents(
      `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
        userOtpRequestData.error.issues
      )}`,
      "error.txt"
    );

    throw new RequestValidationError(userOtpRequestData.error.issues);
  }

  const userOtp = userOtpRequestData.data;
});
