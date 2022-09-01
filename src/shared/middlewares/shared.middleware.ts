import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { UserDTO } from "../../user/dto/user.dto";
import { isEmpty, validate } from "class-validator";
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
      if (key == 'role_name' && value == 'Moderator')
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
      if (key == 'role_name' && value == 'User')
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
      if (key == 'role_name' && value == 'Admin')
        role.role = true
    });
    if (!role.role) {
      return this.httpResponse.Unauthorized(res, "You do not have permission");
    }
    next();
  }
  userChangePasswordValidator(req: Request, res: Response, next: NextFunction) {
    const {
      old_password
      , new_password
    } = req.body;

    if (!req.body.hasOwnProperty('old_password')) {
      return this.httpResponse.Error(res, "Please specify the old_password property");
    }

    if (!req.body.hasOwnProperty('new_password')) {
      return this.httpResponse.Error(res, "Please specify the new_password property");
    }

    return next();
  }
}
