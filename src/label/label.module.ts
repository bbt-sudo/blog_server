import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [LabelController],
  providers: [LabelService],
})
export class LabelModule {}
