import { BaseService } from "./base.service";
import { RoleEntity } from "../role/entitites/role.entity";
import { InitUserService } from "./init.default.users"
export class InitRoleService extends BaseService<RoleEntity>  {

    private initUserService: InitUserService = new InitUserService();
    constructor() {
        super(RoleEntity);
    }
    async initRoles() {
        this.initRoleAdmin();
        this.initRoleModerator();
        this.initRoleUser();
    }
    async initRoleAdmin(): Promise<RoleEntity | null> {
        const rolesExists = (await this.execRepository).findOne({
            where:
                { role_name: 'Admin' }
        });
        if (await rolesExists === null) {
            const role = (await this.execRepository).save({ role_name: 'Admin' });
            if (role !== null) {
                this.initUserService.initUserAdmin((await role).id);
            }
            return role;
        }
        return null;
    }
    async initRoleModerator(): Promise<RoleEntity | null> {
        const rolesExists = (await this.execRepository).findOne({
            where:
                { role_name: 'Moderator' }
        });
        if (await rolesExists === null) {
            (await this.execRepository).save({ role_name: 'Moderator' });
            return rolesExists;
        }
        return null;
    }
    async initRoleUser(): Promise<RoleEntity | null> {
        const rolesExists = (await this.execRepository).findOne({
            where:
                { role_name: 'User' }
        });
        if (await rolesExists === null) {
            (await this.execRepository).save({ role_name: 'User' });
            return rolesExists;
        }
        return null;
    }
}