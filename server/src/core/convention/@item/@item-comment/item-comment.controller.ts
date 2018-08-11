import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {Request} from 'express';

import {
  AuthenticationFailedException,
  ResourceNotFoundException,
} from 'common/exceptions';

import {AuthGuard} from '../../../auth';
import {ItemService} from '../item.service';

import {EditDTO, PostDTO} from './item-comment.dto';
import {ItemCommentService} from './item-comment.service';

@Controller('convention/item/comment')
export class ItemCommentController {
  constructor(
    private itemCommentService: ItemCommentService,
    private itemService: ItemService,
  ) {}

  @Post('post')
  @UseGuards(AuthGuard)
  async post(@Body() data: PostDTO, @Req() req: Request) {
    if (!(await this.itemService.getItemVersionById(data.itemVersionId))) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_VERSION_NOT_FOUND');
    }

    let {id: userId} = req.user;

    let {id} = await this.itemCommentService.create(userId, data);

    return {id};
  }

  @Post('edit')
  @UseGuards(AuthGuard)
  async edit(@Body() data: EditDTO, @Req() req: Request) {
    let comment = await this.itemCommentService.getOneById(data.id);

    if (!comment) {
      throw new ResourceNotFoundException('COMMENT_NOT_FOUND');
    }

    if (comment.userId !== req.user.id) {
      throw new AuthenticationFailedException('NO_ACCESS_TO_CURRENT_COMMENT');
    }

    comment.content = data.content;

    await this.itemCommentService.save(comment);
  }

  @Post('delete/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number, @Req() req: Request) {
    let comment = await this.itemCommentService.getOneById(id);

    if (!comment) {
      throw new ResourceNotFoundException('COMMENT_NOT_FOUND');
    }

    if (comment.userId !== req.user.id) {
      throw new AuthenticationFailedException('NO_ACCESS_TO_CURRENT_COMMENT');
    }

    await this.itemCommentService.delete(comment);
  }
}
