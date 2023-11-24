import { User } from "../models/user";
import { RegisterUser } from "../schemas/register-user-schema";
import { logEvents } from "../middleware/log-events";
import {
  BadRequestError,
  NotFoundError,
} from "@craftyverse-au/craftyverse-common";

export class UserService {
  static async getUserByEmail(userEmail: string) {
    const existingUser = await User.findOne({ userEmail: userEmail });
    const responseUser = existingUser?.toJSON();
    return responseUser;
  }

  static async getUserByRefreshToken(userRefreshToken: string) {
    const existingUser = await User.findOne({
      userRefreshToken: userRefreshToken,
    });
    const responseUser = existingUser?.toJSON();
    return responseUser;
  }

  static async createUser(user: RegisterUser, refreshToken: string) {
    const newUser = User.build({
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      userEmail: user.userEmail,
      userPassword: user.userPassword,
      userRefreshToken: refreshToken,
      userRoles: user.userRoles,
    });

    return await newUser.save();
  }

  static async updateUserField(
    userEmail: string,
    field: string,
    value: string
  ) {
    const user = await User.findOne({ userEmail: userEmail });
    if (!user) {
      const methodName = "updateUserField";
      const message = "User does not exist.";
      logEvents(
        `${methodName}\t${message}\t${userEmail}\t${field}\t${value}`,
        "error.txt"
      );
      throw new NotFoundError("User does not exist.");
    }

    user.set(field, value);
    await user.save();
    return user;
  }

  static async deleteRefreshTokenByUser(refreshToken: string) {
    console.log("This is the refresh token", refreshToken);
    const user = await User.findOne({ userRefreshToken: refreshToken });

    console.log("This is the user", user);

    if (!user) {
      const methodName = "deleteRefreshTokenByUser";
      const message = "User does not exist.";
      logEvents(`${methodName}\t${message}\t${refreshToken}`, "error.txt");
      throw new NotFoundError("User does not exist.");
    }

    await User.findOneAndUpdate(
      { userEmail: user?.userEmail },
      { userRefreshToken: "" }
    );

    const loggedOutUser = await User.findOne({
      userEmail: user?.userEmail,
    });

    if (!loggedOutUser) {
      throw new BadRequestError("Uable to log the user out");
    }

    return loggedOutUser.toJSON();
  }
}
