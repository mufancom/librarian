import {Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common';

import {api} from 'utils/api-formater';
import {passwordEncrypt} from 'utils/encrypt';
import {Validate, Wrap} from 'utils/validator';

import {AuthGuard} from '../auth/auth.guard';
import {User} from './user.entity';
import {UserService} from './user.service';

import {ChangePasswordDto, LoginDto, RegisterDto} from './dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @Validate()
  async login(
    @Wrap(LoginDto)
    @Body()
    data: LoginDto,
  ) {
    const user: User | undefined = await this.userService.findByIdentifier(
      data.username,
    );
    if (!user || user.password !== passwordEncrypt(data.password)) {
      throw api.error('invalid username or password', 4001);
    }

    await this.userService.generateToken(user);

    return api.success({
      id: user.id,
      role: user.role,
      username: user.username,
      avatar: user.avatar,
      token: user.token,
    });
  }

  @Post('register')
  @Validate()
  async register(
    @Wrap(RegisterDto)
    @Body()
    data: RegisterDto,
  ) {
    if (await this.userService.findByIdentifier(data.username, 'username')) {
      throw api.error('username already exists', 4001);
    }
    if (await this.userService.findByIdentifier(data.email, 'email')) {
      throw api.error('email already exists', 4002);
    }

    const user: User = {
      ...data,
      id: undefined,
      password: passwordEncrypt(data.password),
      role: 1,
    };
    await this.userService.registerUser(user);

    return api.success();
  }

  @Post('chg_pw')
  @Validate()
  async changePassword(
    @Wrap(ChangePasswordDto)
    @Body()
    data: ChangePasswordDto,
  ) {
    return 'you are here to change your pwd';
  }

  @Get('info')
  async info(@Query('id') id: number) {
    let user = await this.userService.findByIdentifier(id, 'id');
    if (!user) {
      throw api.error('user not found', 4001);
    }

    let {username, email, avatar} = user;

    return api.success({id, username, email, avatar});
  }
}
