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

import {API} from 'utils/api-formater';
import {encryptPassword} from 'utils/encryption';
import {Validate, Wrap} from 'utils/validator';

import {AuthGuard} from '../auth/auth.guard';
import {ChangePasswordDTO, RegisterDTO} from './dto';
import {User} from './user.entity';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Validate()
  async register(
    @Wrap(RegisterDTO)
    @Body()
    data: RegisterDTO,
  ) {
    if (await this.userService.findByIdentifier(data.username, 'username')) {
      throw API.error('username already exists', 4001);
    }

    if (await this.userService.findByIdentifier(data.email, 'email')) {
      throw API.error('email already exists', 4002);
    }

    const user: User = {
      ...data,
      id: undefined,
      password: encryptPassword(data.password),
      role: 1,
    };

    await this.userService.saveUser(user);

    return API.success();
  }

  @Post('chg_pw')
  @UseGuards(AuthGuard)
  async changePassword(
    @Req() req: Request,
    @Wrap(ChangePasswordDTO)
    @Body()
    data: ChangePasswordDTO,
  ) {
    if (req.user.password !== encryptPassword(data.oldPassword)) {
      throw API.error('invalid old password', 4001);
    }

    req.user.password = encryptPassword(data.newPassword);

    await this.userService.saveUser(req.user);

    return API.success();
  }

  @Get('info')
  async info(@Query('id') id: number) {
    let user = await this.userService.findByIdentifier(id, 'id');

    if (!user) {
      throw API.error('user not found', 4001);
    }

    let {username, email, avatar} = user;

    return API.success({id, username, email, avatar});
  }
}
