/* eslint-disable prettier/prettier */

export class ReturnCommentTree {
  id: number;
  content: string;
  user: UserComment;
  parentId: number;
  reply_toId: number;
  CreateTime: Date;
}

export class UserComment {
  id: string;
  email: string;
  user_account: string;
  nick_Name: string;
  head_Sculpture: string;
}
