import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequireLogin, RequirePermission } from 'src/core/custom.decorator';

@Controller('auth')
@RequireLogin()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RequireLogin()
  @RequirePermission('ADMIN/CREATEROLE')
  @Post('/createRole')
  async createRole(@Body() body: any) {
    return await this.authService.createRole(body);
  }

  @RequireLogin()
  @RequirePermission('ADMIN/DELETEROLE')
  @Post('/delRole')
  async delRole(@Body() body: any) {
    return await this.authService.delRole(body);
  }

  @RequireLogin()
  @RequirePermission('ADMIN/FINDROLE')
  @Get('/findRole')
  async findRole() {
    return await this.authService.findRole();
  }

  @RequireLogin()
  @RequirePermission('ADMIN/CREATEPERMISSION')
  @Post('/createPermission')
  async createPermission(@Body() body: any) {
    return await this.authService.createPermission(body);
  }

  @RequireLogin()
  @RequirePermission('ADMIN/DELETEPERMISSION')
  @Post('/delPermission')
  async delPermission(@Body() body: any) {
    return await this.authService.delPermission(body);
  }

  @RequireLogin()
  @RequirePermission('ADMIN/FINDPERMISSION')
  @Get('/findPermission')
  async findPermissione() {
    return await this.authService.findPermission();
  }

  @RequireLogin()
  @RequirePermission('ADMIN/ROLEBINDPREMISSION')
  @Post('roleSavePermission')
  async roleSavePermission(@Body() body: any) {
    return await this.authService.roleSavePermission(body);
  }
}
