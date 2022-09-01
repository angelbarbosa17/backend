import { MinLength } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Unique } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { RoleEntity } from "../../role/entitites/role.entity";
//import { RoleType } from "../dto/user.dto";

@Entity({ name: "tbl_users" })
@Unique(['user_login', 'user_email','user_identification'])
export class UserEntity extends BaseEntity {
  @Column()
  user_identification!: string;

  @Column()
  user_name!: string;

  @Column()
  user_last_name!: string;

  @Column()
  @MinLength(6)
  user_login!: string;

  @Column()
  @MinLength(6)
  user_email!: string;

  @Column()
  @MinLength(7)
  user_phone!: string;

  @Column({ select: false })
  user_password!: string;

  @Column({ nullable: true, select: false })
  user_old_password?: string;

  @Column({ nullable: true, select: false })
  user_token?: string;

  @Column({ nullable: true, select: false })
  user_reset_token?: string;

  @Column({ nullable: true, select: false })
  user_refresh_token?: string;

  @Column("bit", { default: true })
  user_status!: boolean;

  @Column()
  role_id!: string;

  @ManyToOne(() => RoleEntity, (user) => user.users)
  @JoinColumn({ name: "role_id" })
  role!: RoleEntity;

}

