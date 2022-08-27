import { BaseService } from "./base.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserDTO } from "../user/dto/user.dto"
import * as bcrypt from "bcrypt";

export class InitUserService extends BaseService<UserEntity> {
    constructor() {
        super(UserEntity);
    }
    async initUserAdmin(id: string): Promise<UserEntity | null> {
        const userExists = (await this.execRepository).findOne({
            where:
                { user_login: 'admin' }
        });
        if (await userExists === null) {
            const body = {
                user_identification: this.getEnvironment("USER_IDENTIFICATION"),
                user_name: this.getEnvironment("USER_NAME"),
                user_last_name: this.getEnvironment("USER_LAST_NAME"),
                user_login: this.getEnvironment("USER_LOGIN"),
                user_email: this.getEnvironment("USER_EMAIL"),
                user_phone: this.getEnvironment("USER_PHONE"),
                user_password: this.getEnvironment("USER_PASSWORD"),
                user_status: true,
                role_id: id
            }
            const newUser = (await this.execRepository).create(body);
            const hashPass = await bcrypt.hash(newUser.user_password, 10);
            newUser.user_password = hashPass;
            return (await this.execRepository).save(newUser);
        }
        return null;
    }
}