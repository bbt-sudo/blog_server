const {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} = require('typeorm');
import { Article } from '../../article/entities/article.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  // 父类别 ID，用于表示类别的层级关系
  @Column({
    nullable: true,
  })
  parentId: number;

  // 文章关联

  @OneToMany(() => Article, (article) => article.category, {
    cascade: true,
  })
  articles: Article[];
}
