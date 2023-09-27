import { Injectable } from '@nestjs/common';
import { IsEmail, IsEmpty, IsNotEmpty, Length } from 'class-validator';

@Injectable()
export class CreateUserDto {
  @IsNotEmpty({
    message: '账户不能为空',
  })
  @Length(6, 10, {
    message: '长度在6,10个字符',
  })
  user_account: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail()
  email: string;

  @IsEmpty()
  phone?: number;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nick_Name: string;

  head_Sculpture?: string;
}
