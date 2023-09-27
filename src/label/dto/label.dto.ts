import { TagType } from '../entities/label.entity';

export class CreateLabelDto {
  name: string;

  description: string;

  // 标签类别

  type: TagType;
}

export class UpdateLabelDto {
  name?: string;

  description?: string;

  // 标签类别

  type?: TagType;
}
