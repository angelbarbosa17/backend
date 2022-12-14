import { Request, Response } from "express";
import { DeleteResult, UpdateResult } from "typeorm";
import * as bcrypt from "bcrypt";
import { BaseService } from "../../config/base.service";
import { UserDTO } from "../dto/user.dto";
import { UserEntity } from "../entities/user.entity";
export class UserService extends BaseService<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  async findAllUser(req: Request): Promise<{ total_pages: number; total_files: number; result: number; page: number; rows: UserEntity[]; }> {
    try {
      const [list, count] = await (await this.execRepository).findAndCount({
        select: req.body.params.find,
        order: req.body.params.order,
        skip: req.body.params.page * req.body.params.size,//offset
        take: req.body.params.size,//limit
        cache: false,
      });
      return {
        'total_pages': Math.ceil(count / req.body.params.size),
        'total_files': count,
        'result': req.body.params.size > count ? count : req.body.params.size,
        'page': Math.ceil(count / req.body.params.size) !== null ? req.body.params.page : Math.ceil(count / req.body.params.size),
        'rows': list,
      };
    } catch (error) {
      const [list, count] = await (await this.execRepository).findAndCount({
        skip: 0,//offset
        take: 1,//limit
        cache: false,
      });
      return {
        'total_pages': Math.ceil(count / req.body.params.size),
        'total_files': count,
        'result': req.body.params.size > count ? count : req.body.params.size,
        'page': Math.ceil(count / req.body.params.size) !== null ? req.body.params.page : Math.ceil(count / req.body.params.size),
        'rows': list,
      };
    }
  }
  async findUserById(id: string): Promise<UserEntity | null> {
    return (await this.execRepository).findOneBy({ id });
  }

  async findUserWithRole(
    id: string,
    role_id: string
  ): Promise<UserEntity | null> {
    const user = (await this.execRepository)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "users")
      .where({ id })
      .andWhere({ role_id })
      .getOne();

    return user;
  }

  async findUserWithRelation(id: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "users")
      .where({ id })
      .getOne();
  }

  async findByEmail(user_email: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("user")
      .addSelect("user.user_password")
      .where({ user_email })
      .getOne();
  }

  async checkPassword(id: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("user")
      .addSelect("user.user_password")
      .where({ id })
      .getOne();
  }

  async findByUsername(user_login: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("user")
      .addSelect("user.user_password")
      .where({ user_login })
      .getOne();
  }
  async createUser(body: UserDTO): Promise<{ process: boolean, message: string, data: UserEntity | null}> {
    const newUser = (await this.execRepository).create(body);
    const hashPass = await bcrypt.hash(newUser.user_password, 10);
    newUser.user_password = hashPass;
    const unique = await (await this.execRepository).findOne({
      where: [
        { user_identification: newUser.user_identification },
        { user_login: newUser.user_login },
        { user_email: newUser.user_email }
      ]
    });
    if (!unique) {
      return {
        process: true,
        message: "The user has been created successfully",
        data: await (await this.execRepository).save(newUser)
      }
    } else {
      return {
        process: false,
        message: "User data is already registered, please validate and try again.",
        data: null
      }
    }
  }

  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<UpdateResult> {
    const valid = new UserDTO();
    const updatePass = (await this.execRepository).create(valid);
    updatePass.user_old_password = await bcrypt.hash(oldPassword, 10);
    updatePass.user_password = await bcrypt.hash(newPassword, 10);
    return (await this.execRepository).update(id, {
      user_password: updatePass.user_password,
      user_old_password: updatePass.user_old_password
    });
  }

  async deleteUser(id: string): Promise<{ message: string; data: DeleteResult | null }> {
    const exist = await (await this.execRepository).findOneBy({ id });
    if (exist) {
      return {
        message: 'Item removed successfully.',
        data: await (await this.execRepository).delete({ id })
      }
    } else {
      return {
        message: 'The item to be removed does not exist.',
        data: null
      }
    }
  }
  async updateUser(id: string, infoUpdate: UserDTO): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
}
