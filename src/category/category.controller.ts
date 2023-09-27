import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategory } from './dto/category.dto';
import { RequireLogin, RequirePermission } from 'src/core/custom.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @RequireLogin()
  @RequirePermission('ADMIN/CREATECATEGORY')
  @Post('create')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @RequireLogin()
  @RequirePermission('USER/FINDALLCATEGORY')
  @Get('all')
  async findAll() {
    const category = await this.categoryService.findAll();
    return category;
  }

  @RequireLogin()
  @RequirePermission('USER/FINDONECATEGORY')
  @Get()
  async findOne(@Query('id') id: string) {
    return await this.categoryService.findOne(+id);
  }

  @RequireLogin()
  @RequirePermission('ADMIN/UPDATECATEGORY')
  @Patch()
  async update(
    @Query('id') id: string,
    @Body() updateCategoryDto: UpdateCategory,
  ) {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @RequireLogin()
  @RequirePermission('ADMIN/DELETECATEGORY')
  @Delete()
  async remove(@Query('id') id: string) {
    return await this.categoryService.remove(+id);
  }
}
