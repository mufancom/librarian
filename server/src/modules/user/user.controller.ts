import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {Request} from 'express';

import {api} from 'utils/api-formater';
import {passwordEncrypt} from 'utils/encrypt';
import {Validate, Wrap} from 'utils/validator';

import {AuthGuard} from '../auth/auth.guard';

import {ChangePasswordDto, RegisterDto} from './dto';
import {User} from './user.entity';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Validate()
  async register(
    @Wrap(RegisterDto)
    @Body()
    data: RegisterDto,
  ) {
    if (await this.userService.findByIdentifier(data.username, 'username')) {
      throw api.error('username already exists', 4001);
    }
    if (await this.userService.findByIdentifier(data.email, 'email')) {
      throw api.error('email already exists', 4002);
    }

    const user: User = {
      ...data,
      id: undefined,
      password: passwordEncrypt(data.password),
      role: 1,
    };
    await this.userService.saveUser(user);

    return api.success();
  }

  @Post('chg_pw')
  @UseGuards(AuthGuard)
  async changePassword(
    @Req() req: Request,
    @Wrap(ChangePasswordDto)
    @Body()
    data: ChangePasswordDto,
  ) {
    if (req.user.password !== passwordEncrypt(data.oldPassword)) {
      throw api.error('invalid old password', 4001);
    }

    req.user.password = passwordEncrypt(data.newPassword);
    await this.userService.saveUser(req.user);

    return api.success();
  }

  @Get('info')
  async info(@Query('id') id: number) {
    let user = await this.userService.findByIdentifier(id, 'id');
    if (!user) {
      throw api.error('user not found', 4001);
    }

    let {username, email, avatar} = user;

    return api.success({id, username, email, avatar});
  }
}
