import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import {
  registeruserRequestSchema,
  registeruserResponse,
  registerUser,
} from "../schemas/register-user-schema";
import { UserService } from "../services/users";
import {
  RequestValidationError,
  ConflictError,
  awsSnsClient,
} from "@craftyverse-au/craftyverse-common";
import { logEvents } from "../middleware/log-events";

const registeruserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // Validating user data
    const authenticateUserData = registeruserRequestSchema.safeParse(req.body);

    if (!authenticateUserData.success) {
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
          authenticateUserData.error.issues
        )}`,
        "error.txt"
      );
      throw new RequestValidationError(authenticateUserData.error.issues);
    }

    const user: registerUser = authenticateUserData.data;

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

    //  Check if user has accepted terms and conditions
    if (!user.isTermsAndConditionsAccepted) {
      const methodName = "isTermsAndConditionsAccepted";
      const message = "User must accept terms and conditions.";
      logEvents(
        `${req.method}\t${req.headers.origin}\t${methodName}\t${message}`,
        "error.txt"
      );
      throw new Error(message);
    }

    // Create new user
    const userRoles = Object.values(user.userRoles);

    const userInfo = {
      UserInfo: {
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        userEmail: user.userEmail,
        userRoles,
      },
    };

    // Generate JWT
    const accessToken = jwt.sign(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET
        ? process.env.ACCESS_TOKEN_SECRET
        : "secret",
      { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      userInfo,
      process.env.REFRESH_TOKEN_SECRET
        ? process.env.REFRESH_TOKEN_SECRET
        : "secret",
      { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    );

    // publish a message to sns topic
    const snsClient = awsSnsClient.createSnsClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
      },
    });

    await awsSnsClient.publishSnsMessage(snsClient, {
      message: JSON.stringify(userInfo),
      subject: "craftyverse-auth-service/user-created",
      topicArn: process.env.USER_CREATED_SNS_TOPIC_ARN as string,
    });

    await UserService.createUser(user, refreshToken);

    const createdUserResponse: registeruserResponse = {
      userAccessToken: accessToken,
    };

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure:
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "staging",
      maxAge: 24 * 60 * 60 * 1000, // 1 Day
    });

    res.status(201).json(createdUserResponse);
  }
);

export { registeruserHandler };
