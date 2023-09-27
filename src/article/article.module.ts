import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Category } from '../category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Tag } from 'src/label/entities/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, User, Tag])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
