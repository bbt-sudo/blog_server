import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Tag } from 'src/label/entities/label.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';

export enum ArticleStatus {
  //草稿、已发布、已删除
  Draft = 'draft',
  Published = 'published',
  Deleted = 'deleted',
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'title',
    type: 'varchar',
  })
  title: string;

  @Column()
  subtitle: string;

  @Column()
  content: string;

  @CreateDateColumn()
  created_Time: Date;

  @UpdateDateColumn()
  updated_Time: Date;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @ManyToOne(() => Category, (category) => category.articles, {
    nullable: true,
  })
  category: Category;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
  })
  status: ArticleStatus;

  @ManyToMany(() => Tag, {
    nullable: true,
  })
  @JoinTable({
    name: 'article_tags',
  })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.article, {
    cascade: true,
  })
  comments: Comment[];
}
