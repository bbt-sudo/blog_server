import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLabelDto, UpdateLabelDto } from './dto/label.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/label.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LabelService {
  @InjectRepository(Tag)
  private tagRepository: Repository<Tag>;
  async create(createLabelDto: CreateLabelDto) {
    const tag = new Tag();
    tag.name = createLabelDto.name;
    tag.description = createLabelDto.description;
    tag.type = createLabelDto.type;
    return await this.tagRepository.save(tag);
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOne(id: number) {
    return await this.tagRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateLabelDto: UpdateLabelDto) {
    const tag = await this.tagRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.BAD_REQUEST);
    }

    tag.name = updateLabelDto.description;
    tag.description = updateLabelDto.description;
    tag.type = updateLabelDto.type;
    await this.tagRepository.save(tag);
    return 'success';
  }

  async remove(id: number) {
    const tag = await this.tagRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.BAD_REQUEST);
    }

    await this.tagRepository.remove(tag);

    return 'success';
  }
}
