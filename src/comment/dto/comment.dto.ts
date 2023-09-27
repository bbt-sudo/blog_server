export class CreateCommentDto {
  content: string;

  userId: string;

  articleId: string;
}
export class ReplyDto {
  content: string;
  parentId: number;
  reply_toId?: number;
  userId: string;

  articleId: string;
}
