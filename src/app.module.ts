import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './core/login.guard';
import { PermissionGuard } from './core/permission.guard';
import { ArticleModule } from './article/article.module';
import { LabelModule } from './label/label.module';
import { CategoryModule } from './category/category.module';
import { User } from './user/entities/user.entity';
import { Role } from './auth/entities/role.entity';
import { Permission } from './auth/entities/permission.entity';
import { Article } from './article/entities/article.entity';
import { Category } from './category/entities/category.entity';
import { Tag } from './label/entities/label.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '203.33.207.138',
      port: 3306,
      username: 'nest_test',
      password: '5LPX6zjd3pXzmzar',
      database: 'nest_test',
      entities: [User, Role, Permission, Article, Category, Tag, Comment],
      synchronize: true,
    }),
    AuthModule,
    ArticleModule,
    LabelModule,
    CategoryModule,
    UserModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
