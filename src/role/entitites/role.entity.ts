import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Entity({ name: "tbl_role" })
export class RoleEntity extends BaseEntity {
  @Column({ unique: true })
  role_name!: string;

  @Column("bit", { default: true })
  role_status!: boolean;

  @OneToMany(() => UserEntity, (user) => user.role)
  users!: UserEntity[];
}
