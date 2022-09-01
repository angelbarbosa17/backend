import { SharedMiddleware } from "../shared/middlewares/shared.middleware";
import { BaseRouter } from "../shared/router/router";
import { AuthController } from "./controllers/auth.controller";

export class AuthRouter extends BaseRouter<AuthController, SharedMiddleware> {
  constructor() {
    super(AuthController, SharedMiddleware);
  }

  routes(): void {
    this.router.post("/auth/sign-in/", this.middleware.passAuth("login"), (req, res) =>
      this.controller.login(req, res)
    );

    this.router.post("/auth/change-password/", 
      this.middleware.passAuth("jwt"), 
      (req, res, next) => this.middleware.checkAdminRole(req, res, next),
      (req, res, next) => this.middleware.userChangePasswordValidator(req, res, next),
      (req, res) => this.controller.changePassword(req, res)
    );

    // this.router.post("/auth/refresh-access-token/"/*, this.middleware.passAuth("login")*/, (req, res) =>
    //   this.controller.refreshToken(req, res)
    // );
  }
}
