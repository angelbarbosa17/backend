import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";

export class RoleDTO extends BaseDTO {
  
  @IsNotEmpty()
  role_name!: string;

  @IsNotEmpty()
  role_status!: boolean;
}
