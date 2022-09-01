import { ConfigServer } from "../../config/config";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { UserService } from "../../user/services/user.service";
import { UserEntity } from "../../user/entities/user.entity";
import { PayloadToken } from "../interfaces/auth.interface";
import { UserDTO } from "../../user/dto/user.dto";

export class AuthService extends ConfigServer {
  constructor(
    private readonly userService: UserService = new UserService(),
    private readonly jwtInstance = jwt
  ) {
    super();
  }

  public async validateUser(
    user_login: string,
    user_password: string
  ): Promise<UserEntity | null> {
    const userByEmail = await this.userService.findByEmail(user_login);
    const userByUsername = await this.userService.findByUsername(user_login);

    if (userByUsername) {
      const isMatch = await bcrypt.compare(user_password, userByUsername.user_password);
      if (isMatch) {
        return userByUsername;
      }
    }
    if (userByEmail) {
      const isMatch = await bcrypt.compare(user_password, userByEmail.user_password);
      if (isMatch) {
        return userByEmail;
      }
    }

    return null;
  }

  //JWT_SECRET

  sing(payload: jwt.JwtPayload, secret: any) {
    return this.jwtInstance.sign(payload, secret, { expiresIn: "1h" });
  }

  public async generateJWT(
    user: UserEntity
  ): Promise<{ accessToken: string; user: UserEntity }> {
    const userConsult = await this.userService.findUserWithRole(
      user.id,
      user.role_id
    );
    const payload: PayloadToken = {
      role_id: userConsult!.role_id,
      role_name: userConsult!.role.role_name,
      user_login: userConsult!.user_login,
      user_mail: userConsult!.user_email,
      id: userConsult!.id
    };

    if (userConsult) {
      user.user_password = "Not permission";
    }

    return {
      accessToken: this.sing(payload, this.getEnvironment("JWT_SECRET")),
      user,
    };
  }
  public async generateNewpass(user: UserEntity, oldPassword: string, newPassword: string): Promise<{ message: string; process: boolean; }> {
    const userConsult = await this.userService.checkPassword(user.id);
    try {
      if (userConsult) {
        const isMatch = await bcrypt.compare(oldPassword, userConsult!.user_password);
        if (!isMatch) {
          return {
            message: "The above password does not match or the user does not exist.",
            process: false,
          }
        }
        const update = await this.userService.changePassword(user.id, oldPassword, newPassword);
        if (!update) {
          return {
            message: "Password not updated",
            process: false
          }
        }
        return {
          message: "Password has been updated successfully",
          process: true
        }
      }
      return {
        message: "Password not updated",
        process: false
      }
    } catch (error) {
      return {
        message: "Password not updated",
        process: false
      }
    }
  }
}
