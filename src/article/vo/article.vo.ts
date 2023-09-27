/* eslint-disable prettier/prettier */
import { Tag } from 'src/label/entities/label.entity';
import { Article } from '../entities/article.entity';
import { Category } from 'src/category/entities/category.entity';
export class CreateArticleVo {
  user_id: string;

  user_account: string;

  email: string;

  phone: number;

  nick_Name: string;

  head_Sculpture: string;
  articles: Article[];
}
export class Author {
  authorId: string;
  email: string;
  user_account: string;
  nick_Name: string;
  head_Sculpture: string;
}
export class FindOneVo {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  status: string;
  created_Time: Date;
  updated_Time: Date;
  category: Category;
  author: Author;
  tags: Tag[];
}
