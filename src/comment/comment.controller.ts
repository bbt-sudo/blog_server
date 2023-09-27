import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, ReplyDto } from './dto/comment.dto';
import {
  RequireLogin,
  RequirePermission,
  UserInfo,
} from 'src/core/custom.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @RequireLogin()
  @RequirePermission('USER/CREATECOMMENT')
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.create(createCommentDto);
  }

  @RequireLogin()
  @RequirePermission('USER/REPLYCOMMENT')
  @Post('replyToComment')
  async replyToComment(@Body() replyDto: ReplyDto) {
    return await this.commentService.replyToComment(replyDto);
  }

  @Get('firstcomments')
  async findFirstCommentByArticle(@Query('articleId') articleId: string) {
    return await this.commentService.firstComments(articleId);
  }

  @RequireLogin()
  @RequirePermission('USER/FINDESECONDCOMMENT')
  @Get('secondcomments')
  async findSecondCommentByArticle(
    @Query('articleId') articleId: string,
    @Query('parentId') parentId: number,
  ) {
    return this.commentService.secondComments(articleId, +parentId);
  }

  // @Get('getArticleWithNestedComments')
  // async getArticleWithNestedComments(@Query('articleId') articleId: string) {
  //   return await this.commentService.getArticleWithNestedComments(articleId);
  // }

  @RequireLogin()
  @RequirePermission('ADMIN/FINDEONECOMMENT')
  @Get()
  async findOne(@Query('id') id: string) {
    return await this.commentService.findOne(+id);
  }
  @RequireLogin()
  @RequirePermission('USER/DELETE')
  @Delete()
  async remove(@Query('id') id: string, @UserInfo() userinfo: any) {
    // return userinfo;
    return await this.commentService.remove(+id, userinfo);
  }
}
