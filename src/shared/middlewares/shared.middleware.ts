import { NextFunction, Request, Response } from "express";
import passport from "passport";
//import { RoleType } from "../../user/dto/user.dto";
import { UserEntity } from "../../user/entities/user.entity";
import { HttpResponse } from "../response/http.response";

export class SharedMiddleware {
  constructor(public httpResponse: HttpResponse = new HttpResponse()) { }
  passAuth(type: string) {
    return passport.authenticate(type, { session: false });
  }

  checkModeratorRole(req: Request, res: Response, next: NextFunction) {
    const user = req.user as UserEntity;
    const role = { role: '' }
    Object.entries(user).forEach(([key, value], index) => {
      if (key == 'sub' && value == 'Moderator')
        role.role = value
    });
    if (role.role !== "Moderator") {
      return this.httpResponse.Unauthorized(res, "You do not have permission");
    }
    return next();
  }
  checkUserRole(req: Request, res: Response, next: NextFunction) {
    const user = req.user as UserEntity;
    const role = { role: '' }
    Object.entries(user).forEach(([key, value], index) => {
      if (key == 'sub' && value == 'User')
        role.role = value
    });
    if (role.role !== "User") {
      return this.httpResponse.Unauthorized(res, "You do not have permission");
    }
    return next();
  }
  checkAdminRole(req: Request, res: Response, next: NextFunction) {
    const user = req.user as UserEntity;
    const role = { role: false }
    Object.entries(user).forEach(([key, value], index) => {
      if (key == 'sub' && value == 'Admin')
        role.role = true
    });
    if (!role.role) {
      return this.httpResponse.Unauthorized(res, "You do not have permission");
    }
    next();
  }
}
