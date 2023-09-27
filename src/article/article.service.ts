import { Injectable } from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Tag } from 'src/label/entities/label.entity';
import { Author, FindOneVo } from './vo/article.vo';

@Injectable()
export class ArticleService {
  @InjectRepository(Article)
  private articleRepository: Repository<Article>;

  @InjectRepository(Category)
  private categoryRepository: Repository<Category>;

  @InjectRepository(Tag)
  private tagRepository: Repository<Tag>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  async create(createArticleDto: CreateArticleDto) {
    const article = new Article();
    let category = null;
    if (createArticleDto.categoryId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      category = await this.categoryRepository.findOne({
        where: {
          id: createArticleDto.categoryId,
        },
      });
    }

    let tags: Tag[] = [];

    if (createArticleDto.tgaIds) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tags = await this.tagRepository.findByIds(createArticleDto.tgaIds);
    }

    const newUser = await this.userRepository.findOne({
      where: {
        id: createArticleDto.authorId,
      },
    });
    const user = new User();
    user.id = newUser.id;
    user.email = newUser.email;
    user.user_account = newUser.user_account;
    user.nick_Name = newUser.nick_Name;
    user.head_Sculpture = newUser.head_Sculpture;
    article.title = createArticleDto.title;
    article.subtitle = createArticleDto.subtitle;
    article.content = createArticleDto.content;
    article.status = createArticleDto.status;
    article.category = category;
    article.author = user;
    article.tags = tags;
    const newArticle = await this.articleRepository.save(article);

    return newArticle;
  }

  async fuzzyQueryArticleAll(content: string) {
    const articleList = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'user')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tag')
      .where(
        'article.title LIKE :title OR article.subtitle LIKE :subtitle OR article.content LIKE :content',
        {
          title: '%' + content + '%',
          subtitle: '%' + content + '%',
          content: '%' + content + '%',
        },
      )
      .getMany();

    const vo: FindOneVo[] = [];
    for (let i = 0; i < articleList.length; i++) {
      const article = new FindOneVo();
      article.id = articleList[i].id;
      article.title = articleList[i].title;
      article.subtitle = articleList[i].subtitle;
      article.content = articleList[i].content;
      article.status = articleList[i].status;
      article.created_Time = articleList[i].created_Time;
      article.updated_Time = articleList[i].updated_Time;
      article.category = articleList[i].category;
      const author = new Author();
      author.authorId = articleList[i].author.id;
      author.email = articleList[i].author.email;
      author.user_account = articleList[i].author.user_account;
      author.nick_Name = articleList[i].author.nick_Name;
      author.head_Sculpture = articleList[i].author.head_Sculpture;
      article.author = author;
      article.tags = articleList[i].tags;
      vo.push(article);
    }

    return vo;
  }

  async findOneById(id: string) {
    const article = await this.articleRepository.findOne({
      where: {
        id: id,
      },
      relations: ['category', 'tags', 'author'],
    });
    const vo = new FindOneVo();
    vo.id = article.id;
    vo.title = article.title;
    vo.subtitle = article.subtitle;
    vo.content = article.content;
    vo.status = article.status;
    vo.created_Time = article.created_Time;
    vo.updated_Time = article.updated_Time;
    vo.category = article.category;
    console.log(article.author.id);
    const author = new Author();
    author.authorId = article.author.id;
    author.email = article.author.email;
    author.user_account = article.author.user_account;
    author.nick_Name = article.author.nick_Name;
    author.head_Sculpture = article.author.head_Sculpture;
    vo.author = author;
    vo.tags = article.tags;
    return vo;
  }

  async findAll(page?: number, limit?: number) {
    let skip: number;
    let take: number;
    if (page && limit) {
      skip = (page - 1) * limit;
      take = limit;
    }
    const articles = await this.articleRepository.find({
      skip,
      take,
      relations: ['category', 'tags', 'author'],
    });
    const vo: FindOneVo[] = [];
    for (let i = 0; i < articles.length; i++) {
      const article = new FindOneVo();
      article.id = articles[i].id;
      article.title = articles[i].title;
      article.subtitle = articles[i].subtitle;
      article.content = articles[i].content;
      article.status = articles[i].status;
      article.created_Time = articles[i].created_Time;
      article.updated_Time = articles[i].updated_Time;
      article.category = articles[i].category;
      const author = new Author();
      author.authorId = articles[i].author.id;
      author.email = articles[i].author.email;
      author.user_account = articles[i].author.user_account;
      author.nick_Name = articles[i].author.nick_Name;
      author.head_Sculpture = articles[i].author.head_Sculpture;
      article.author = author;
      article.tags = articles[i].tags;
      vo.push(article);
    }
    return vo;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!article) {
      throw new Error('Article not found');
    }
    article.title = updateArticleDto.title;
    article.subtitle = updateArticleDto.subtitle;
    article.content = updateArticleDto.content;
    article.status = updateArticleDto.status;

    // 如果传入了分类 ID，则更新文章分类
    if (updateArticleDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: {
          id: updateArticleDto.categoryId,
        },
      });
      article.category = category;
    }
    await this.articleRepository.save(article);
    return article;
  }

  async remove(id: string) {
    // 查询要删除的文章
    const article = await this.articleRepository.findOne({
      where: {
        id: id,
      },
    });
    // 如果找到了文章，则删除文章
    if (article) {
      await this.articleRepository.remove(article);
      return 'success';
    } else {
      return 'Article not found';
    }
  }

  async findByCategory(categoryId: number): Promise<Article[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    const articles = await this.articleRepository.find({
      where: [
        {
          category: category,
        },
      ],
    });
    return articles;
  }

  async findByTags(tagIds: string[], page?: number, limit?: number) {
    let skip: number;
    let take: number;
    if (page && limit) {
      skip = (page - 1) * limit;
      take = limit;
    }
    const tags = await this.tagRepository.findByIds(tagIds);
    const articles = await this.articleRepository.find({
      where: {
        tags: tags,
      },
      relations: ['category', 'tags', 'author'],
      skip,
      take,
    });
    const vo: FindOneVo[] = [];
    for (let i = 0; i < articles.length; i++) {
      const article = new FindOneVo();
      article.id = articles[i].id;
      article.title = articles[i].title;
      article.subtitle = articles[i].subtitle;
      article.content = articles[i].content;
      article.status = articles[i].status;
      article.created_Time = articles[i].created_Time;
      article.updated_Time = articles[i].updated_Time;
      article.category = articles[i].category;
      const author = new Author();
      author.authorId = articles[i].author.id;
      author.email = articles[i].author.email;
      author.user_account = articles[i].author.user_account;
      author.nick_Name = articles[i].author.nick_Name;
      author.head_Sculpture = articles[i].author.head_Sculpture;
      article.author = author;
      article.tags = articles[i].tags;
      vo.push(article);
    }

    return vo;
  }
}
