/* eslint-disable prettier/prettier */
const {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} = require('typeorm');

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 20,
    comment: '权限代码',
  })
  code: string;

  @Column({
    length: 100,
    comment: '权限描述',
  })
  description: string;

  @CreateDateColumn()
  create_Time: Date;

  @UpdateDateColumn()
  update_Time: Date;
}
