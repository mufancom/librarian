import {Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
import {Request} from 'express';

import {ResourceNotFoundException} from 'common/exceptions';

import {AuthGuard} from '../../../auth';
import {ItemService} from '../item.service';

import {ItemThumbUpService} from './item-thumb-up.service';

@Controller('convention/item/thumb-up')
export class ItemThumbUpController {
  constructor(
    private itemThumbUpService: ItemThumbUpService,
    private itemService: ItemService,
  ) {}

  @Get(':versionId')
  @UseGuards(AuthGuard)
  async thumbUp(@Param('versionId') versionId: number, @Req() {user}: Request) {
    let itemVersion = await this.itemService.getItemVersionById(versionId);

    if (!itemVersion) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_VERSION_NOT_FOUND');
    }

    await this.itemThumbUpService.thumbUp(user, itemVersion.id);
  }

  @Get(':versionId/cancel')
  @UseGuards(AuthGuard)
  async cancelThumbUp(
    @Param('versionId') versionId: number,
    @Req() {user}: Request,
  ) {
    await this.itemThumbUpService.cancelThumbUp(user, versionId);
  }

  @Get(':versionId/check')
  @UseGuards(AuthGuard)
  async check(@Param('versionId') versionId: number, @Req() {user}: Request) {
    return this.itemThumbUpService.getByUserAndItemVersionId(user, versionId);
  }
}
