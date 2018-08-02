import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {Length} from 'class-validator';

import {api} from 'utils/api-formater';
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
    const user: User = await this.userService
      .findByUsername(data.username)
      .catch(reason => {
        throw api.error('invalid username or password', 4001);
      });

    return api.success(user);
  }

  @Get('info')
  info(@Query('id') id: number) {
    return id;
  }
}
