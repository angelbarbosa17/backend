import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { HttpResponse } from "../../shared/response/http.response";
import { DeleteResult, UpdateResult } from "typeorm";

export class UserController {
  constructor(
    private readonly userService: UserService = new UserService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) { }
  async getUsers(req: Request, res: Response) {
    try {
      const data = await this.userService.findAllUser(req);
      if (data.rows.length === 0) {
        return this.httpResponse.NotFound(res, "No existe dato");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.userService.findUserById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe dato");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }
  async getUserWithRelationById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.userService.findUserWithRelation(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe dato");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }
  async createUser(req: Request, res: Response) {
    try {
      const { process, message, data } = await this.userService.createUser(req.body);      
      if(process && data){
        return this.httpResponse.Ok(res, data);
      }
      return this.httpResponse.Error(res, message);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: UpdateResult = await this.userService.updateUser(
        id,
        req.body
      );
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "It is not possible to update the record");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const { message, data } = await this.userService.deleteUser(id);
      if (!(data?.affected)) {
        return this.httpResponse.NotFound(res, "It is not possible to remove the record. " + message);
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
