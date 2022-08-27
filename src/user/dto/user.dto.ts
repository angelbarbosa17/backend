import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { RoleEntity } from "../../role/entitites/role.entity";

export class UserDTO extends BaseDTO {
  @IsNotEmpty()
  user_identification!: string;

  @IsNotEmpty()
  user_name!: string;

  @IsNotEmpty()
  user_last_name!: string;

  @IsNotEmpty()
  user_login!: string;
  
  @IsNotEmpty()
  user_email!: string;
  
  @IsNotEmpty()
  user_phone!: string;

  @IsNotEmpty()
  user_password!: string;
  
  user_password_change?: string;

  user_token?: string;
  
  @IsNotEmpty()
  user_status!: boolean;  

  @IsNotEmpty()
  role_id!: string;
}