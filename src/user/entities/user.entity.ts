import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { RoleEntity } from "../../role/entitites/role.entity";
//import { RoleType } from "../dto/user.dto";

@Entity({ name: "tbl_users" })
export class UserEntity extends BaseEntity {
  @Column()
  user_identification!: string;

  @Column()
  user_name!: string;

  @Column()
  user_last_name!: string;

  @Column({ unique: true })
  user_login!: string;

  @Column({ unique: true })
  user_email!: string;

  @Column()
  user_phone!: string;

  @Column({ select: false })
  user_password!: string;

  @Column(
    {
      nullable: true,
      select: false
    }
  )
  user_password_change?: string;
  @Column(
    {
      nullable: true,
      select: false
    }
  )
  user_token?: string;

  @Column("bit", { default: true })
  user_status!: boolean;

  // @Column({ type: "simple-enum", enum: RoleType, nullable: false })
  // role!: RoleType;
  @Column()
  role_id!: string;

  @ManyToOne(() => RoleEntity, (user) => user.users)
  @JoinColumn({ name: "role_id" })
  role!: RoleEntity;

}

