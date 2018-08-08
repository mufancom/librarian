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

import {
  AuthenticationFailedException,
  ResourceConflictingException,
  ResourceNotFoundException,
} from 'common/exceptions';
import {comparePassword, encryptPassword} from 'utils/encryption';

import {AuthGuard} from '../auth';
import {ChangePasswordDTO, RegisterDTO} from './user.dto';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() data: RegisterDTO) {
    if (await this.userService.findByIdentifier(data.username, 'username')) {
      throw new ResourceConflictingException('USERNAME_ALREADY_EXISTS');
    }

    if (await this.userService.findByIdentifier(data.email, 'email')) {
      throw new ResourceConflictingException('EMAIL_ALREADY_EXISTS');
    }

    await this.userService.createUser({
      ...data,
      password: await encryptPassword(data.password),
      role: 1,
    });
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() data: ChangePasswordDTO,
    @Req() {user}: Request,
  ) {
    if (!(await comparePassword(data.oldPassword, user.password))) {
      throw new AuthenticationFailedException('USERNAME_PASSWORD_MISMATCH');
    }

    user.password = await encryptPassword(data.newPassword);

    await this.userService.saveUser(user);
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
