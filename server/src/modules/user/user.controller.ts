import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {Length, validate} from 'class-validator';
import {Response} from 'express';

import {DataWrapper, Wrap} from 'utils/validator';
import {UserService} from './user.service';

export class LoginPostData extends DataWrapper {
  @Length(4, 20)
  username!: string;

  @Length(8, 48)
  readonly password!: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async login(
    @Res() res: Response,
    @Wrap()
    @Body()
    data: LoginPostData,
  ) {
    data = new LoginPostData(data);
    return validate(data).then(errors => errors);
  }

  @Get('info')
  info(@Query('id') id: number) {
    return id;
  }
}
