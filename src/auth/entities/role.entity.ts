import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  create_Time: Date;

  @UpdateDateColumn()
  update_Time: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_premission',
  })
  permissions: Permission[];
}
