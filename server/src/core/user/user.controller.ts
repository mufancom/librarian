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

import {comparePassword, encryptPassword} from 'utils/encryption';

import {
  AuthenticationFailedException,
  ResourceConflictingException,
  ResourceNotFoundException,
} from 'common/exceptions';
import {AuthGuard} from '../auth';
import {ChangePasswordDTO, RegisterDTO} from './dto';
import {User} from './user.entity';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() data: RegisterDTO) {
    if (await this.userService.findByIdentifier(data.username, 'username')) {
      throw new ResourceConflictingException('USERNAME_ALREADY_EXISTS');
    }

    if (await this.userService.findByIdentifier(data.email, 'email')) {
      throw new ResourceConflictingException('EMAIL_ALREADY_EXISTS');
    }

    const user: User = {
      ...data,
      password: await encryptPassword(data.password),
      role: 1,
    };

    await this.userService.saveUser(user);
  }

  @Post('chg_pw')
  @UseGuards(AuthGuard)
  async changePassword(@Body() data: ChangePasswordDTO, @Req() req: Request) {
    if (!(await comparePassword(data.oldPassword, req.user.password))) {
      throw new AuthenticationFailedException('USERNAME_PASSWORD_MISMATCH');
    }

    req.user.password = await encryptPassword(data.newPassword);

    await this.userService.saveUser(req.user);
  }

  @Get('info')
  async info(@Query('id') id: number) {
    let user = await this.userService.findByIdentifier(id, 'id');

    if (!user) {
      throw new ResourceNotFoundException('USER_NOT_FOUND');
    }

    let {username, email, avatar} = user;

    return {id, username, email, avatar};
  }
}
