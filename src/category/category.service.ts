import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategory } from './dto/category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';

export class NewCategory {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  articles: Article[];
  childrens: Category[] = [];
}

@Injectable()
export class CategoryService {
  @InjectRepository(Category)
  private categoryRepository: Repository<Category>;

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();

    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: {
          id: createCategoryDto.parentId,
        },
      });
      if (!parent) {
        throw new HttpException('没有父亲', HttpStatus.BAD_REQUEST);
      }
    }
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;
    category.parentId = createCategoryDto.parentId;

    await this.categoryRepository.save(category);
    return 'success';
  }

  async findAll() {
    const categoryList = await this.categoryRepository.find();
    const categoryTree: NewCategory[] = [];

    for (let i = 0; i < categoryList.length; i++) {
      const newCategory = new NewCategory();

      newCategory.id = categoryList[i].id;
      newCategory.name = categoryList[i].name;
      newCategory.description = categoryList[i].description;
      newCategory.parentId = categoryList[i].parentId;
      categoryTree.push(newCategory);
    }

    const tree = this.buildTree(categoryTree);
    return tree;
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategory) {
    const c = await this.findOne(id);
    if (!c) {
      throw new HttpException('Category不存在', HttpStatus.BAD_REQUEST);
    }

    const category = await this.categoryRepository.findOne({
      where: {
        id: id,
      },
    });
    category.name = updateCategoryDto.name;
    category.description = updateCategoryDto.description;
    await this.categoryRepository.save(category);
    return 'success';
  }

  async remove(id: number) {
    const c = await this.findOne(id);
    if (!c) {
      throw new HttpException('Category不存在', HttpStatus.BAD_REQUEST);
    }

    await this.categoryRepository.remove(c);
    return 'success';
  }

  buildTree(categoryList: NewCategory[], parentId?: number | string) {
    const tree: NewCategory[] = [];

    for (let i = 0; i < categoryList.length; i++) {
      if (!categoryList[i].parentId) {
        tree.push(categoryList[i]);
      }
      for (let j = 0; j < categoryList.length; j++) {
        if (categoryList[i].id === categoryList[j].parentId) {
          tree[i].childrens.push(categoryList[j]);
        }
      }
    }
    // console.log(categoryList);

    return tree;
  }
}
