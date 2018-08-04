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
import {Validate, Wrap} from 'utils/validator';

import {
  AuthenticationFailedException,
  EmailAlreadyExistsException,
  UserNotFoundException,
  UsernameAlreadyExistsException,
} from 'common/exceptions';
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
      throw new UsernameAlreadyExistsException();
    }

    if (await this.userService.findByIdentifier(data.email, 'email')) {
      throw new EmailAlreadyExistsException();
    }

    const user: User = {
      ...data,
      id: undefined,
      password: await encryptPassword(data.password),
      role: 1,
    };

    await this.userService.saveUser(user);
  }

  @Post('chg_pw')
  @UseGuards(AuthGuard)
  async changePassword(
    @Req() req: Request,
    @Wrap(ChangePasswordDTO)
    @Body()
    data: ChangePasswordDTO,
  ) {
    if (await comparePassword(data.oldPassword, req.user.password)) {
      throw new AuthenticationFailedException();
    }

    req.user.password = await encryptPassword(data.newPassword);

    await this.userService.saveUser(req.user);
  }

  @Get('info')
  async info(@Query('id') id: number) {
    let user = await this.userService.findByIdentifier(id, 'id');

    if (!user) {
      throw new UserNotFoundException();
    }

    let {username, email, avatar} = user;

    return {id, username, email, avatar};
  }

  @Get('test')
  async test() {}
}
