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

import {ResourceNotFoundException} from 'common/exceptions';

import {AuthGuard} from '../auth';
import {ConventionService} from '../convention';
import {PostDTO} from './comment.dto';
import {Comment} from './comment.entity';
import {CommentService} from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private conventionService: ConventionService,
  ) {}

  @Get('list')
  async list(
    @Query('filePath') filePath: string,
    @Query('page') page: number = 1,
  ) {
    return this.commentService.listComments(filePath, page);
  }

  @Post('post')
  @UseGuards(AuthGuard)
  async post(@Body() data: PostDTO, @Req() req: Request) {
    let now = Date.now();

    let comment: Comment = {
      ...data,
      userId: req.user.id,
      createdAt: now,
      updatedAt: now,
    };

    if (!(await this.conventionService.exists(data.filePath))) {
      throw new ResourceNotFoundException('CONVENTION_NOT_FOUND');
    }

    await this.commentService.saveComment(comment);
  }
}
