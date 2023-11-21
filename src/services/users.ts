import { User } from "../models/user";
import { RegisterUser } from "../schemas/register-user-schema";
import { logEvents } from "../middleware/log-events";

export class UserService {
  static async getUserByEmail(userEmail: string): Promise<any> {
    const existingUser = await User.findOne({ userEmail: userEmail });
    const responseUser = existingUser?.toJSON();
    return responseUser;
  }

  static async createUser(user: RegisterUser) {
    const newUser = User.build({
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      userEmail: user.userEmail,
      userPassword: user.userPassword,
    });

    await newUser.save();
  }
}
