import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TagType {
  ARTICLE = 'article',
  VIDEO = 'video',
}
@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  // 标签类别
  @Column({
    type: 'enum',
    enum: TagType,
  })
  type: TagType;
}
