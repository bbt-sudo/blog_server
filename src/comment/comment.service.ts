import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto, ReplyDto } from './dto/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ReturnCommentTree, UserComment } from './vo/comment.vo';

@Injectable()
export class CommentService {
  @InjectRepository(Comment)
  private commentRepository: Repository<Comment>;

  @InjectRepository(Article)
  private articleRepository: Repository<Article>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  async create(createCommentDto: CreateCommentDto) {
    const article = await this.articleRepository.findOne({
      where: {
        id: createCommentDto.articleId,
      },
    });
    if (!article) {
      throw new HttpException(
        '哎呀！这篇文章怎么没有了',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userRepository.findOne({
      where: {
        id: createCommentDto.userId,
      },
    });

    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.article = article;
    comment.user = user;
    const newComment = await this.commentRepository.save(comment);
    return newComment;
  }

  async replyToComment(replyDto: ReplyDto) {
    const { parentId, content, userId, articleId, reply_toId } = replyDto;
    const article = await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
    });
    if (!article) {
      throw new NotFoundException('article not found');
    }
    const comment = await this.commentRepository.findOne({
      where: {
        id: parentId,
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const reply = await this.commentRepository.findOne({
      where: {
        parentId: parentId,
        reply_toId: reply_toId,
      },
    });
    if (!reply) {
      throw new NotFoundException('reply not found');
    }
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newComment = new Comment();
    newComment.content = content;
    newComment.article = article;
    newComment.user = user;
    newComment.parentId = comment.id;
    newComment.reply_toId = reply_toId;
    // 3. 将回复评论对象与父评论对象关联起来
    const savedReply = await this.commentRepository.save(reply);
    return 'success';
  }

  // async getArticleWithComments(articleId: string) {
  //   // 查询文章
  //   const article = await this.articleRepository.findOne({
  //     where: {
  //       id: articleId,
  //     },
  //   });

  //   // 查询一级评论
  //   const comments = await this.commentRepository.find({
  //     where: {
  //       article: article,
  //       parent: null, // 只查询没有父级评论的评论，即一级评论
  //     },
  //     relations: ['replies'], // 加载子级评论
  //   });

  //   // 返回文章及其一级评论
  //   return {
  //     article: article,
  //     comments: comments,
  //   };
  // }

  // // 查询文章及其多级评论
  // async getArticleWithNestedComments(articleId: string) {
  //   // 查询文章
  //   const article = await this.articleRepository.findOne({
  //     where: { id: articleId },
  //   });

  //   // 递归查询多级评论
  //   const getNestedComments = async (comment: Comment) => {
  //     const replies = await this.commentRepository
  //       .createQueryBuilder('comment')
  //       .leftJoinAndSelect('comment.replies', 'reply')
  //       .leftJoinAndSelect('comment.replies', 'reply')
  //       .where('comment.articleId = :articleId', {
  //         articleId,
  //       })
  //       .andWhere('comment.parentId = :parentId', { parentId: comment.id })
  //       .getMany();
  //     console.log(replies);

  //     comment.replies = replies;

  //     for (const reply of replies) {
  //       await getNestedComments(reply);
  //     }
  //   };

  //   // 查询一级评论

  //   const comments = await this.commentRepository
  //     .createQueryBuilder('comment')
  //     .leftJoinAndSelect('comment.replies', 'replies')
  //     .where('comment.articleId = :articleId', { articleId: article.id })
  //     .andWhere('comment.parentId IS NULL')
  //     .getMany();

  //   // 查询多级评论
  //   for (const comment of comments) {
  //     await getNestedComments(comment);
  //   }

  //   // 返回文章及其多级评论
  //   return {
  //     article: article,
  //     comments: comments,
  //   };
  // }

  async firstComments(articleId: string) {
    // const comments = await this.commentRepository
    //   .createQueryBuilder()
    //   .leftJoinAndSelect('comment.user', 'user')
    //   .where('comment.parentId IS NULL')
    //   .andWhere('comment.articleId = :articleId', { articleId })
    //   .getMany();
    const article = await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
    });
    const c = await this.commentRepository.find({
      where: {
        article: article,
        parentId: null,
      },
      relations: ['user'],
    });
    return c;
  }

  async secondComments(articleId: string, parentId: number) {
    const comments = await this.commentRepository.find({
      where: {
        parentId: parentId,
        article: {
          id: articleId,
        },
      },
      relations: ['user'],
    });
    const newComments: ReturnCommentTree[] = [];

    for (const comment of comments) {
      const newComment = new ReturnCommentTree();
      const user = new UserComment();
      user.id = comment.user.id;
      user.user_account = comment.user.user_account;
      user.email = comment.user.email;
      user.nick_Name = comment.user.nick_Name;
      user.head_Sculpture = comment.user.head_Sculpture;
      newComment.id = comment.id;
      newComment.content = comment.content;
      newComment.parentId = comment.parentId;
      newComment.reply_toId = comment.reply_toId;
      newComment.user = user;
      newComment.CreateTime = comment.CreateTime;
      newComments.push(newComment);
    }
    return newComments;
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!comment) {
      throw new HttpException('哎嘿！没有找到这个评论', HttpStatus.BAD_REQUEST);
    }

    return comment;
  }

  async remove(id: number, userinfo: any) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user'],
    });
    if (!comment) {
      throw new HttpException('哎呀！没有找到这个评论', HttpStatus.BAD_REQUEST);
    }
    if (comment.user.id !== userinfo.userId) {
      throw new HttpException('哎呀！是不是删错评论了', HttpStatus.BAD_REQUEST);
    }
    const childrenComment = await this.commentRepository
      .createQueryBuilder()
      .where('comment.parentId = :parentId', { parentId: id })
      .getMany();
    if (childrenComment.length > 0) {
      await this.commentRepository.remove(childrenComment);
    }
    await this.commentRepository.remove(comment);
    return 'success';
  }
}
