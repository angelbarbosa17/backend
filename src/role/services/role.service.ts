import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { RoleEntity } from "../entitites/role.entity";
import { RoleDTO } from "../dto/role.dto";
import { UserService } from "../../user/services/user.service";
//import { RoleType } from "../../user/dto/user.dto";
import { UserEntity } from "../../user/entities/user.entity";
export class RoleService extends BaseService<RoleEntity> {
  constructor(private readonly userService: UserService = new UserService()) {
    super(RoleEntity);

  }

  async findAllRoles(): Promise<RoleEntity[]> {
    return (await this.execRepository).find();
  }
  async findRoleById(id: string): Promise<RoleEntity | null> {
    return (await this.execRepository).findOneBy({ id });
  }
  async createRole(body: RoleDTO): Promise<{ message: string; createRole?: RoleEntity | null | undefined | any }> {
    const newRole = (await this.execRepository).create(body);
    const exists = await (await this.execRepository).findOneBy({
      role_name: body.role_name,
    });
    if (exists===null) {
      return {
        message: 'Object created in database.',
        createRole: await (await this.execRepository).save(newRole)
      };
    } else {
      return {
        message: 'The role already exists in the database.',
        createRole: null
      };
    }
  }
  async deleteRole(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
  async updateRole(
    id: string,
    infoUpdate: RoleDTO
  ): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
}
