import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import {Request} from 'express';

import {AuthenticationFailedException} from 'common/exceptions';
import {AuthGuard, AuthService} from 'core/auth';
import {comparePassword} from 'utils/encryption';

import {LoginDTO} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDTO, @Req() req: Request) {
    let user = await this.authService.findUserByUsernameOrEmail(data.username);

    if (!user || !(await comparePassword(data.password, user.password))) {
      throw new AuthenticationFailedException('USERNAME_PASSWORD_MISMATCH');
    }

    let session = req.session!;

    session.user = {id: user.id};

    return {
      ...user,
      password: undefined,
    };
  }

  @Get('check')
  @UseGuards(AuthGuard)
  async checkStatus(@Req() req: Request) {
    return {...req.user, password: undefined};
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  async logout(@Session() session: Express.Session) {
    session.user = undefined;
  }
}
