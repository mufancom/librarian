import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {Length} from 'class-validator';

import {api} from 'utils/api-formater';
import {passwordEncrypt} from 'utils/encrypt';
import {Validate, Wrap} from 'utils/validator';

import {User} from './user.entity';
import {UserService} from './user.service';

class LoginPostData {
  @Length(4, 20, {message: '用户名长度为4-20位'})
  username!: string;

  @Length(8, 48, {message: '密码长度为8-48位'})
  readonly password!: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Validate()
  async login(
    @Wrap(LoginPostData)
    @Body()
    data: LoginPostData,
  ) {
    const user: User | undefined = await this.userService.findByUsernameOrEmail(
      data.username,
    );
    if (!user || user.password !== passwordEncrypt(data.password)) {
      throw api.error('invalid username or password', 4001);
    }
    await this.userService.generateToken(user);
    return api.success({
      id: user.id,
      role: user.role,
      username: user.username,
      avatar: user.avatar,
      token: user.token,
    });
  }

  @Get('info')
  info(@Query('id') id: number) {
    return id;
  }
}
