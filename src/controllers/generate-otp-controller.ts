import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";
import nodemailer from "nodemailer";
import { UserService } from "../services/users";
import { userOtpRequestSchema, userOtpRequest } from "../schemas/otp-schema";
import { logEvents } from "../middleware/log-events";
import { configureNodemailer } from "../utils/nodemailer";
import {
  BadRequestError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";

const generateOTPHandler = asyncHandler(async (req: Request, res: Response) => {
  // Configure nodemailer
  const nodemailerTransporter = await configureNodemailer();
  // Retrieving user's email for verificatrion
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

  // Checking for existing user in database
  const existingUser = await UserService.getUserByEmail(userOtp.userEmail);
  if (!existingUser) {
    const methodName = "generateOTP";
    const message = "User does not exist. Please register.";
    logEvents(
      `${req.method}\t${req.headers.origin}\t${methodName}\t${message}`,
      "error.txt"
    );
    throw new BadRequestError(message);
  }

  // Generate a unique 6 character string as the OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: process.env.NODEMAILER_OTP_HOST_EMAIL,
    to: userOtp.userEmail,
    subject: process.env.NODEMAILER_OTP_HOST_SUBJECT,
    text: `Your OTP is ${otp}`,
  };

  // Save the OTP to the database against the user
  await UserService.updateUserField(existingUser.userEmail, "userOtp", otp);

  // Send the OTP to the user's email
  nodemailerTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
          error
        )}`,
        "error.txt"
      );
      throw new BadRequestError("OTP could not be sent");
    } else {
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
          info
        )}`,
        "reqLog.txt"
      );
      res.status(200).send({
        message: `OTP sent successfully ${info.response}`,
      });
    }
  });
});

export { generateOTPHandler };
