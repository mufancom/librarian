import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {Request} from 'express';

import {
  AuthenticationFailedException,
  ResourceNotFoundException,
  ValidationException,
} from '../../../../common/exceptions';
import {AuthGuard} from '../../../../core/auth';
import {ItemCommentService, ItemService} from '../../../../core/convention';

import {EditDTO, PostDTO} from './item-comment.dto';

@Controller('convention/item/comment')
export class ItemCommentController {
  constructor(
    @Inject(ItemCommentService) private itemCommentService: ItemCommentService,
    @Inject(ItemService) private itemService: ItemService,
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

  @Get('list')
  async list(@Query('version_id') versionId: number, @Query('page') page = 1) {
    if (!(await this.itemService.getItemVersionById(versionId))) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_VERSION_NOT_FOUND');
    }

    if (page < 1) {
      throw new ValidationException('INVALID_PAGE_NUMBER');
    }

    return this.itemCommentService.getManyWithUserInfoByItemVersionId(
      versionId,
      page,
    );
  }

  @Get(':id/delete')
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
