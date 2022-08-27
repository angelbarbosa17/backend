import { ConfigServer } from "../../config/config";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { UserService } from "../../user/services/user.service";
import { UserEntity } from "../../user/entities/user.entity";
import { PayloadToken } from "../interfaces/auth.interface";

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
      role: userConsult!.role_id,
      sub: userConsult!.role.role_name,
    };

    if (userConsult) {
      user.user_password = "Not permission";
    }

    return {
      accessToken: this.sing(payload, this.getEnvironment("JWT_SECRET")),
      user,
    };
  }
}
