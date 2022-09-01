//import { RoleType } from "../../user/dto/user.dto";

export interface PayloadToken {
  role_id: string;
  role_name: string;
  user_login: string;
  user_mail: string;
  id: string;
}

export interface RoleInit {
  role_name: string;
  role_status: boolean;
}
