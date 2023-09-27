import { ArticleStatus } from '../entities/article.entity';

export class CreateArticleDto {
  title: string;

  subtitle: string;

  content: string;

  status: ArticleStatus;

  categoryId?: number;
  authorId: string;
  tgaIds?: string[];
}

export class UpdateArticleDto {
  title?: string;

  subtitle?: string;

  content?: string;

  status?: ArticleStatus;

  categoryId?: number;
}
