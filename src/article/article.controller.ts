import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/article.dto';
import { RequireLogin, RequirePermission } from 'src/core/custom.decorator';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @RequireLogin()
  @RequirePermission('USER/CREATEARTICLE')
  @Post('create')
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @RequireLogin()
  @RequirePermission('USER/FUZZYQUERY')
  @Get('fuzzyquery')
  async fuzzyQueryArticleAll(@Query('content') content: string) {
    return await this.articleService.fuzzyQueryArticleAll(content);
  }

  @RequireLogin()
  @RequirePermission('USER/FINDONEARTICLE')
  @Get('article')
  async findOne(@Query('id') id: string) {
    return await this.articleService.findOneById(id);
  }

  @Get('articles')
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return await this.articleService.findAll(+page, +limit);
  }

  @Get('categoryId')
  async findByCategory(@Query('categoryId') categoryId: string) {
    return await this.articleService.findByCategory(+categoryId);
  }

  @Get('bytag')
  async findByTags(
    @Body('tagIds') tagIds: string[],
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.articleService.findByTags(tagIds, +page, +limit);
  }

  @RequireLogin()
  @RequirePermission('USER/UPDATEARTICLE')
  @Patch()
  update(@Query('id') id: string, @Body() data: any) {
    return this.articleService.update(id, data);
    // return { id, data };
  }

  @RequireLogin()
  @RequirePermission('USER/DELETEARTICLE')
  @Delete()
  async remove(@Query('id') id: string) {
    return await this.articleService.remove(id);
  }
}
