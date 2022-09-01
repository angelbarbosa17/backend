import { IsEmail, IsNotEmpty, IsOptional, } from "class-validator";
import { Unique } from "typeorm";
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
  @IsEmail()
  user_email!: string;

  @IsNotEmpty()
  user_phone!: string;

  @IsNotEmpty()
  user_password!: string;

  @IsOptional()
  user_old_password?: string;

  @IsOptional()
  user_token?: string;

  @IsOptional()
  user_reset_token?: string;

  @IsOptional()
  user_refresh_token?: string;

  @IsNotEmpty()
  user_status!: boolean;

  @IsNotEmpty()
  role_id!: string;
}