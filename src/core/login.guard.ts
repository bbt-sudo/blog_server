import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Permission } from 'src/auth/entities/permission.entity';

interface JwtUserData {
  userId: string;
  userAccount: string;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject()
  private authService: AuthService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];

      // this.authService.isToken(token).then((res) => {
      //   console.log(res);
      // });
      const user = this.authService.isToken(token);
      request.user = {
        userId: user.data.userId,
        userAccount: user.data.userAccount,
        roles: user.data.roles,
        permissions: user.data.permissions,
      };

      return true;
    } catch (e) {
      throw new UnauthorizedException('login token失效,请重新登录');
    }
  }
}
