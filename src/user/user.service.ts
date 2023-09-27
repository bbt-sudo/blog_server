import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserVo } from './vo/creat.user.vo';
import { LoginUserDto } from './dto/login.user.dto';
import { Role } from 'src/auth/entities/role.entity';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  async create(createUserDto: CreateUserDto) {
    const u = await this.userRepository.findOne({
      where: {
        user_account: createUserDto.user_account,
        email: createUserDto.email,
      },
    });
    if (u) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.userRepository.save(createUserDto);

      return '注册成功';
    } catch (e) {
      this.logger.error(e);
      return '注册失败';
    }
  }

  async login(loginDto: LoginUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...u } = loginDto;
    const user = await this.userRepository.findOne({
      where: {
        ...u,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (loginDto.password !== user.password) {
      throw new HttpException('密码不对', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      user_account: user.user_account,
      nick_Name: user.nick_Name,
      email: user.email,
      phone: user.phone,
      head_Sculpture: user.head_Sculpture,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      created_Time: user.created_Time,
      updated_Time: user.updated_Time,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
    return vo;
  }

  async findById(id: string) {
    const u = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (!u) {
      throw new HttpException('没有此用户', HttpStatus.BAD_REQUEST);
    }
    return {
      id: u.id,
      user_account: u.user_account,
      isAdmin: u.isAdmin,
      roles: u.roles.map((item) => item.name),
      permissions: u.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  async findByUserAccount() {}

  async userBindRole(body: any) {
    const role = await this.roleRepository.findOne({
      where: {
        id: body.roleId,
      },
    });

    const u = await this.userRepository.findOne({
      where: {
        id: body.userId,
      },
      relations: ['roles'],
    });

    u.roles.push(role);
    await this.userRepository.save(u);
    return 'yes';
  }
}
