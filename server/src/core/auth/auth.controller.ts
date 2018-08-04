import {Body, Controller, Inject, Post, Req, forwardRef} from '@nestjs/common';
import {Request} from 'express';

import {AuthenticationFailedException} from 'common/exceptions';
import {comparePassword} from 'utils/encryption';
import {Validate, Wrap} from 'utils/validator';

import {AuthService} from './auth.service';
import {LoginDTO} from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @Validate()
  async login(
    @Wrap(LoginDTO)
    @Body()
    data: LoginDTO,
    @Req() req: Request,
  ) {
    let user = await this.authService.findUserByUsernameOrEmail(data.username);

    if (!user || !(await comparePassword(data.password, user.password))) {
      throw new AuthenticationFailedException();
    }

    let session = req.session as Express.Session;

    session.user = {id: user.id};
  }
}
