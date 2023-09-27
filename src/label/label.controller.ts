import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto, UpdateLabelDto } from './dto/label.dto';
import { RequireLogin, RequirePermission } from 'src/core/custom.decorator';

@Controller('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @RequireLogin()
  @RequirePermission('USER/TAG')
  @Post()
  async create(@Body() createLabelDto: CreateLabelDto) {
    return await this.labelService.create(createLabelDto);
  }

  @RequireLogin()
  @RequirePermission('USER/FINDALLTAG')
  @Get()
  async findAll() {
    return await this.labelService.findAll();
  }

  @RequireLogin()
  @RequirePermission('USER/FINDEONETAG')
  @Get()
  async findOne(@Query('id') id: string) {
    return await this.labelService.findOne(+id);
  }

  @RequireLogin()
  @RequirePermission('ADMIN/UPDATETAG')
  @Patch()
  async update(
    @Query('id') id: string,
    @Body() updateLabelDto: UpdateLabelDto,
  ) {
    return await this.labelService.update(+id, updateLabelDto);
  }

  @RequireLogin()
  @RequirePermission('ADMIN/DELETETAG')
  @Delete()
  async remove(@Query('id') id: string) {
    return await this.labelService.remove(+id);
  }
}
