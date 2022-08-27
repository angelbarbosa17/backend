//import { RoleType } from "../../user/dto/user.dto";

export interface PayloadToken {
  role: string;
  sub: string;
}

export interface RoleInit {
  role_name: string;
  role_status: boolean;
}
