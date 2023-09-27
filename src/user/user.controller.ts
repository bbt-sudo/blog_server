import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Inject,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { AuthService } from 'src/auth/auth.service';
import { RequireLogin, RequirePermission } from 'src/core/custom.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject()
  private authService: AuthService;

  @Post('/register')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const vo = await this.userService.create(createUserDto);
    return vo;
  }

  @Post('/login')
  async Login(@Body(ValidationPipe) loginDto: LoginUserDto) {
    const vo = await this.userService.login(loginDto);
    vo.accessToken = this.authService.issueToken(
      {
        userId: vo.userInfo.id,
        userAccount: vo.userInfo.user_account,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      '30m',
    );
    vo.refreshToken = this.authService.issueToken(
      { userId: vo.userInfo.id },
      '7d',
    );
    return vo;
  }

  @Get('refresh')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    try {
      const data = await this.authService.isToken(refreshToken);

      const u = await this.userService.findById(data.userId);

      const access_token = this.authService.issueToken(
        {
          userId: u.id,
          userAccount: u.user_account,
          roles: u.roles,
          permissions: u.permissions,
        },
        '30m',
      );

      const refresh_toekn = this.authService.issueToken({ userId: u.id }, '7d');
      return {
        access_token,
        refresh_toekn,
      };
    } catch (e) {
      throw new UnauthorizedException('token已失效，请重新登录');
    }
  }

  @RequireLogin()
  @RequirePermission('ADMIN/BINDROLE')
  @Post('userBindRole')
  async userBindRole(@Body() body: any) {
    return await this.userService.userBindRole(body);
  }
}
