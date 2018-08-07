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
  FieldAlreadyExistsException,
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
  @Validate()
  async register(
    @Wrap(RegisterDTO)
    @Body()
    data: RegisterDTO,
    @Req() req: Request,
  ) {
    if (await this.userService.findByIdentifier(data.username, 'username')) {
      throw new FieldAlreadyExistsException(req.lang.usernameAlreadyExists);
    }

    if (await this.userService.findByIdentifier(data.email, 'email')) {
      throw new FieldAlreadyExistsException(req.lang.emailAlreadyExists);
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
  @Validate()
  async changePassword(
    @Wrap(ChangePasswordDTO)
    @Body()
    data: ChangePasswordDTO,
    @Req() req: Request,
  ) {
    if (!(await comparePassword(data.oldPassword, req.user.password))) {
      throw new AuthenticationFailedException(
        req.lang.usernamePasswordMismatch,
      );
    }

    req.user.password = await encryptPassword(data.newPassword);

    await this.userService.saveUser(req.user);
  }

  @Get('info')
  async info(@Query('id') id: number, @Req() req: Request) {
    let user = await this.userService.findByIdentifier(id, 'id');

    if (!user) {
      throw new ResourceNotFoundException(req.lang.userNotFound);
    }

    let {username, email, avatar} = user;

    return {id, username, email, avatar};
  }
}
