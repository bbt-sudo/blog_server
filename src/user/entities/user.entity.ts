import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { Article } from 'src/article/entities/article.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  user_account: string;

  @PrimaryColumn()
  email: string;

  @Column({
    comment: '手机号',
    type: 'int',
    nullable: true,
  })
  phone: number;

  @Column()
  password: string;

  @Column()
  nick_Name: string;

  @Column({
    comment: '头像',
    nullable: true,
  })
  head_Sculpture: string;

  @Column({
    comment: '是否冻结',
    default: false,
  })
  isFrozen: boolean;

  @Column({
    comment: '是否管理员',
    default: false,
  })
  isAdmin: boolean;

  @CreateDateColumn()
  created_Time: Date;

  @UpdateDateColumn()
  updated_Time: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];

  @OneToMany(() => Article, (article) => article.author, {
    cascade: true,
  })
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
