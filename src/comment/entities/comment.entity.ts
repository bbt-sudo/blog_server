import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({
    nullable: true,
  })
  parentId: number;

  @Column({
    nullable: true,
  })
  reply_toId: number;

  @CreateDateColumn()
  CreateTime: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;
}
