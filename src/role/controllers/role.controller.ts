import { Request, Response } from "express";
import { DeleteResult, UpdateResult } from "typeorm";
import { HttpResponse } from "../../shared/response/http.response";
import { RoleService } from "../services/role.service";

export class RoleController {
  constructor(
    private readonly roleService: RoleService = new RoleService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) { }
  async getRoles(req: Request, res: Response) {
    try {
      const data = await this.roleService.findAllRoles();
      if (data.length === 0) {
        return this.httpResponse.NotFound(res, "No existe dato");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }
  async getRoleById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.roleService.findRoleById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe dato");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }
  async createRole(req: Request, res: Response) {
    try {
      const data = await this.roleService.createRole(req.body);
      if (data.createRole !== null) {
        return this.httpResponse.Ok(res, data);
      } else {
        return this.httpResponse.Error(res, data);
      }
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async updateRole(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: UpdateResult = await this.roleService.updateRole(
        id,
        req.body
      );
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Hay un error en actualizar");
      }

      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }
  async deleteRole(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.roleService.deleteRole(id);
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Hay un error en actualizar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
