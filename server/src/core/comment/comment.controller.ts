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
import {Comment} from './comment.entity';
import {CommentService} from './comment.service';
import {PostDTO} from './dto';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly conventionService: ConventionService,
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
    const timeStamp = Date.now();

    let comment: Comment = {
      ...data,
      userId: req.user.id as number,
      createdAt: timeStamp,
      updatedAt: timeStamp,
    };

    if (!(await this.conventionService.exists(data.filePath))) {
      throw new ResourceNotFoundException('CONVENTION_NOT_FOUND');
    }

    await this.commentService.saveComment(comment);
  }
}
