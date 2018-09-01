import {Controller, Get, Inject, Param, Req, UseGuards} from '@nestjs/common';
import {Request} from 'express';

import {ResourceNotFoundException} from '../../../../common/exceptions';
import {AuthGuard} from '../../../../core/auth';
import {ItemService, ItemThumbUpService} from '../../../../core/convention';

@Controller('convention/item/thumb-up')
export class ItemThumbUpController {
  constructor(
    @Inject(ItemThumbUpService) private itemThumbUpService: ItemThumbUpService,
    @Inject(ItemService) private itemService: ItemService,
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
