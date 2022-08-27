import { isEmpty, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { UserDTO } from "../dto/user.dto";
import { HttpResponse } from "../../shared/response/http.response";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";

export class UserMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }
  userValidator(req: Request, res: Response, next: NextFunction) {
    const {
      user_identification
      , user_name
      , user_last_name
      , user_login
      , user_email
      , user_phone
      , user_password
      , user_status
      , role_id
    } = req.body;

    const valid = new UserDTO();

    valid.user_identification = user_identification;
    valid.user_name = user_name;
    valid.user_last_name = user_last_name;
    valid.user_login = user_login;
    valid.user_email = user_email;
    valid.user_phone = user_phone;
    valid.user_password = user_password;
    valid.user_status = user_status;
    valid.role_id = role_id;

    validate(valid).then((err) => {
      if (err.length > 0) {
        return this.httpResponse.Error(res, err);
      } else {
        return next();
      }
    });
  }
  usersFindValidator(req: Request, res: Response, next: NextFunction) {

    const jsonExample = {
      "error": '',
      "params": {
        "attributes":
        {
          "user_identification": true,
          "user_name": true,
        },
        "order": {
          "user_identification": "ASC",
          "user_name": "ASC"
        },
        "page": 0,
        "size": 1
      }
    };
    if (!req.body.hasOwnProperty('params')) {
      jsonExample.error = 'You are not sending the attribute "params". jsonExample:';
      return this.httpResponse.Error(res, jsonExample);
    }
    if (!req.body.params.hasOwnProperty('attributes')) {
      jsonExample.error = 'You are not sending the attribute "attributes". jsonExample:';
      return this.httpResponse.Error(res, jsonExample);
    }
    if (!req.body.params.hasOwnProperty('page') || !req.body.params.hasOwnProperty('size')) {
      jsonExample.error = 'You are not sending page or size attributes. jsonExample:';
      return this.httpResponse.Error(res, jsonExample);
    }

    const staticFields = {
      "user_identification": false
      , "user_name": false
      , "user_last_name": false
      , "user_login": false
      , "user_email": false
      , "user_phone": false
      , "user_status": false
      , "role_id": false
    };

    let errorFields = { "error": "" };
    const attributes = req.body.params.attributes;
    Object.entries(attributes).forEach(([key, value], index) => {
      if (!Object.keys(staticFields).includes(key)) {
        errorFields.error = 'The ' + key + ' attribute does not exist';
      }
    });
    if (Object.keys(errorFields.error).length > 0) {
      return this.httpResponse.Error(res, errorFields);
    }

    staticFields.user_identification = req.body.params.attributes.user_identification;
    staticFields.user_name = req.body.params.attributes.user_name;
    staticFields.user_last_name = req.body.params.attributes.user_last_name;
    staticFields.user_login = req.body.params.attributes.user_login;
    staticFields.user_email = req.body.params.attributes.user_email;
    staticFields.user_phone = req.body.params.attributes.user_phone;
    staticFields.user_status = req.body.params.attributes.user_status;
    staticFields.role_id = req.body.params.attributes.role_id;

    req.body.params.page = req.body.params.page < 0 ? 0 : req.body.params.page;
    req.body.params.size = req.body.params.size > 100 ? 100 : req.body.params.size;
    req.body.params.find = staticFields;

    return next();
  }
  usersDeleteValidator(req: Request, res: Response, next: NextFunction) {

    const jsonExample = {
      "error": "",
      "To permanently delete an item, send the item ID in the URL and in the body of the item - JSON example": {
        "id": '1111111111',
        "delete": true
      }
    };
    const staticFields = {
      "id": "",
      "delete": false,
    };

    let errorFields = { "error": "" };
    Object.entries(req.body).forEach(([key, value], index) => {
      if (!Object.keys(staticFields).includes(key)) {
        errorFields.error = 'The ' + key + ' attribute does not exist';
      }
    });

    if (Object.keys(errorFields.error).length > 0) {
      return this.httpResponse.Error(res, errorFields);
    }

    if (isEmpty(req.body.id)) {
      return this.httpResponse.Error(res, jsonExample);
    }

    if (req.body.hasOwnProperty('id') && req.body.hasOwnProperty('delete')) {
      if (req.body.delete === false) {
        jsonExample.error = 'To delete the item you must send the attribute "delete:true".';
        return this.httpResponse.Error(res, jsonExample);
      }
      if (req.params.id != req.body.id) {
        jsonExample.error = 'To permanently remove the body ID must be equal to the ID of the URL.';
        return this.httpResponse.Error(res, jsonExample);
      }
      return next();
    }
    return this.httpResponse.Error(res, jsonExample);
  }
}