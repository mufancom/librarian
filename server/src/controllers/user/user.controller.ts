import {
  Body,
  Controller,
  Get,
  Inject,
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
import {AuthGuard} from 'core/auth';
import {UserDataService} from 'core/user';
import {comparePassword, encryptPassword} from 'utils/encryption';
import {sendMail} from 'utils/mail';

import {ChangePasswordDTO, RegisterDTO} from './user.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserDataService) private userDataService: UserDataService,
  ) {}

  @Get('test')
  async test() {
    let info = await sendMail({
      to: '10165101106@stu.ecnu.edu.cn',
      subject: 'Hello, Scholar!',
      html: '<b>A mail from node.js!!!</b>',
    });

    return info;
  }

  @Post('register')
  async register(@Body() data: RegisterDTO) {
    if (
      await this.userDataService.findByIdentifier(data.username, 'username')
    ) {
      throw new ResourceConflictingException('USERNAME_ALREADY_EXISTS');
    }

    if (await this.userDataService.findByIdentifier(data.email, 'email')) {
      throw new ResourceConflictingException('EMAIL_ALREADY_EXISTS');
    }

    await this.userDataService.create({
      ...data,
      password: await encryptPassword(data.password),
    });
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() data: ChangePasswordDTO,
    @Req() {user}: Request,
  ): Promise<void> {
    if (!(await comparePassword(data.oldPassword, user.password))) {
      throw new AuthenticationFailedException('USERNAME_PASSWORD_MISMATCH');
    }

    user.password = await encryptPassword(data.newPassword);

    await this.userDataService.save(user);
  }

  @Get('info')
  async info(@Query('id') id: number) {
    let user = await this.userDataService.findByIdentifier(id, 'id');

    if (!user) {
      throw new ResourceNotFoundException('USER_NOT_FOUND');
    }

    let {username, email} = user;

    return {id, username, email};
  }
}
