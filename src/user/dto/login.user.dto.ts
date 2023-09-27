import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

@Injectable()
export class LoginUserDto {
  @IsOptional()
  @IsNotEmpty({
    message: '账户不能为空',
  })
  @Length(6, 10, {
    message: '长度在6,10个字符',
  })
  user_account: string;

  @IsOptional()
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail()
  email: string;

  @IsOptional()
  phone: number;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
