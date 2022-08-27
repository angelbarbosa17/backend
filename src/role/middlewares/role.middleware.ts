import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { RoleDTO } from "../dto/role.dto";
import { RoleEntity } from "../entitites/role.entity";

export class RoleMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }
  roleValidator(req: Request, res: Response, next: NextFunction) {    
    const { role_name, role_status } = req.body;
    const valid = new RoleDTO();

    valid.role_name = role_name;
    valid.role_status = role_status;

    validate(valid).then((err) => {
      if (err.length > 0) {
        return this.httpResponse.Error(res, err);
      } else {
        next();
      }
    });
  }
}
