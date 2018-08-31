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
import {Config} from 'utils/config';
import {comparePassword} from 'utils/encryption';

import {LoginDTO} from './auth.dto';

@Controller('auth')
export class AuthController {
  registerInvitationEnabled: boolean;

  constructor(@Inject(AuthService) private authService: AuthService) {
    let registerConfig = Config.user.get('register');

    this.registerInvitationEnabled = !!(
      registerConfig &&
      registerConfig.enable &&
      registerConfig.method === 'invitation'
    );
  }

  @Post('login')
  async login(@Body() data: LoginDTO, @Req() req: Request) {
    let user = await this.authService.findUserByUsernameOrEmail(data.username);

    if (!user || !(await comparePassword(data.password, user.password))) {
      throw new AuthenticationFailedException('USERNAME_PASSWORD_MISMATCH');
    }

    let session = req.session!;

    session.user = {id: user.id};

    let {registerInvitationEnabled} = this;

    return {
      ...user,
      password: undefined,
      registerInvitationEnabled,
    };
  }

  @Get('check')
  @UseGuards(AuthGuard)
  async checkStatus(@Req() req: Request) {
    let {registerInvitationEnabled} = this;

    return {...req.user, password: undefined, registerInvitationEnabled};
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  async logout(@Session() session: Express.Session) {
    session.user = undefined;
  }
}
