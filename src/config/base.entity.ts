import { v4 as uuidv4 } from 'uuid';
import {
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({
    name: "created_ad",
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_ad",
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}

// //id
// //created_at
// //updated_at

// import { v4 as uuidv4 } from 'uuid';
// import {
//   CreateDateColumn,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm";

// export abstract class BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: string = uuidv4();

//   @CreateDateColumn({
//     name: "created_ad",
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   createdAt!: Date;

//   @UpdateDateColumn({
//     name: "updated_ad",
//     default: () => 'CURRENT_TIMESTAMP',
//     onUpdate: 'CURRENT_TIMESTAMP',
//   })
//   updatedAt!: Date;
// }

// //id
// //created_at
// //updated_at
