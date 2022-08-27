import { BaseRouter } from "../shared/router/router";
import { RoleController } from "./controllers/role.controller";
import { RoleMiddleware } from "./middlewares/role.middleware";
export class RoleRouter extends BaseRouter<
  RoleController,
  RoleMiddleware
> {
  constructor() {
    super(RoleController, RoleMiddleware);
  }

  routes(): void {
    this.router.get("/roles", this.middleware.passAuth("jwt"), (req, res) =>
      this.controller.getRoles(req, res)
    );
    this.router.get(
      "/role/role/:id",
      this.middleware.passAuth("jwt"),
      (req, res) => this.controller.getRoleById(req, res)
    );
    this.router.post(
      "/role/create",
      this.middleware.passAuth("jwt"),
      (req, res, next) => [
        this.middleware.roleValidator(req, res, next)
      ],
      (req, res) => this.controller.createRole(req, res)
    );
    this.router.put(
      "/role/update/:id",
      this.middleware.passAuth("jwt"),
      (req, res) => this.controller.updateRole(req, res)
    );
    this.router.delete(
      "/role/delete/:id",
      this.middleware.passAuth("jwt"),
      (req, res) => this.controller.deleteRole(req, res)
    );
  }
}
