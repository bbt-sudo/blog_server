import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private jwtService: JwtService;

  @InjectRepository(Role)
  private roleRepositoty: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepositoty: Repository<Permission>;

  issueToken(sign: object, expiresIn: string) {
    const token = this.jwtService.sign(
      {
        data: sign,
      },
      {
        expiresIn: expiresIn,
      },
    );
    return token;
  }

  isToken(token: string) {
    const is = this.jwtService.verify(token);
    return is;
  }

  async createRole(body: any) {
    const role = await this.roleRepositoty.save({
      name: body.name,
    });
    return role;
  }

  async delRole(body: any) {
    const r = await this.roleRepositoty.findOne({
      where: {
        id: body.id,
      },
    });
    if (!r) {
      throw new HttpException('此角色,无!', HttpStatus.BAD_REQUEST);
    }
    const role = this.roleRepositoty.delete({
      id: body.id,
    });
    return role;
  }

  async findRole() {
    const role = await this.roleRepositoty.find({
      relations: ['permissions'],
    });
    return role;
  }

  async createPermission(body: any) {
    const permission = await this.permissionRepositoty.save({
      code: body.code,
      description: body.description,
    });
    return permission;
  }

  async delPermission(body: any) {
    const p = await this.permissionRepositoty.findOne({
      where: {
        id: body.id,
      },
    });
    console.log(p);

    if (!p) {
      throw new HttpException('此权限,无!', HttpStatus.BAD_REQUEST);
    }
    const permission = this.permissionRepositoty.delete({
      id: body.id,
    });
    return permission;
  }

  async findPermission() {
    const permission = await this.permissionRepositoty.find();
    return permission;
  }

  async roleSavePermission(body: any) {
    const r = await this.roleRepositoty.findOne({
      where: {
        id: body.roleId,
      },
      relations: ['permissions'],
    });

    const permission = await this.permissionRepositoty.findOne({
      where: {
        id: body.permissionId,
      },
    });

    r.permissions.push(permission);

    const role = await this.roleRepositoty.save(r);
    return role;
  }
}
