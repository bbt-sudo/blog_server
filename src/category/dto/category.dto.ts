export class CreateCategoryDto {
  name: string;

  description: string;

  // 父类别 ID，用于表示类别的层级关系

  parentId?: number;
}

export class UpdateCategory {
  name?: string;
  description?: string;
}
