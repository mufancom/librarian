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

import {Validate, Wrap} from 'utils/validator';
import {AuthGuard} from '../auth';
import {PostDTO} from './dto';

@Controller('comment')
export class CommentController {
  @Get('list')
  list(@Query('page') page: number = 1) {}

  @Post('post')
  @Validate()
  @UseGuards(AuthGuard)
  async post(
    @Wrap(PostDTO)
    @Body()
    data: PostDTO,
    @Req() req: Request,
  ) {
    return req.user;
  }
}
