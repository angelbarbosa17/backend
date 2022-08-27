import { AuthService } from "../services/auth.service";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { UserEntity } from "../../user/entities/user.entity";
import { PassportUse } from "../utils/passport.use";

const authService: AuthService = new AuthService();

export class LoginStrategy {
  async validate(
    user_login: string,
    user_password: string,
    done: any
  ): Promise<UserEntity> {
    try {
      const user = await authService.validateUser(user_login, user_password);
      if (!user) {
        return done(null, false, { message: "Invalid username or password" });
      }
      return done(null, user);
    } catch (error) {
      return done(null, false, { message: "Invalid username or password" });
    }
  }

  get use() {
    return PassportUse<LocalStrategy, Object, VerifyFunction>(
      "login",
      LocalStrategy,
      {
        usernameField: "user_login",
        passwordField: "user_password",
      },
      this.validate
    );
  }
}
