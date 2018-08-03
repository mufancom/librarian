import {Body, Controller, Inject, Post, Req, forwardRef} from '@nestjs/common';
import {Request} from 'express';

import {api} from 'utils/api-formater';
import {passwordEncrypt} from 'utils/encrypt';
import {Validate, Wrap} from 'utils/validator';

import {AuthService} from './auth.service';
import {LoginDto} from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @Validate()
  async login(
    @Wrap(LoginDto)
    @Body()
    data: LoginDto,
    @Req() req: Request,
  ) {
    let user = await this.authService.findUserByUsernameOrEmail(data.username);

    if (!user || user.password !== passwordEncrypt(data.password)) {
      console.log(passwordEncrypt(data.password));
      throw api.error('invalid username or password', 4001);
    }

    let session = req.session as Express.Session;
    session.user = {
      id: user.id,
    };

    return api.success();
  }
}
