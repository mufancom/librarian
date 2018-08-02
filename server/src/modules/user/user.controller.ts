import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {IsEmail, Length} from 'class-validator';

import {api} from 'utils/api-formater';
import {passwordEncrypt} from 'utils/encrypt';
import {Validate, Wrap} from 'utils/validator';

import {User} from './user.entity';
import {UserService} from './user.service';

class LoginPostData {
  @Length(4, 20)
  readonly username!: string;

  @Length(8, 48)
  readonly password!: string;
}

class RegisterPostData extends LoginPostData {
  @Length(6, 50)
  @IsEmail()
  readonly email!: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @Validate()
  async login(
    @Wrap(LoginPostData)
    @Body()
    data: LoginPostData,
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
    @Wrap(RegisterPostData)
    @Body()
    data: RegisterPostData,
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

  @Get('info')
  info(@Query('id') id: number) {
    return id;
  }
}
