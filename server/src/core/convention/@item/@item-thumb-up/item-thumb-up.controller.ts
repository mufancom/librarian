import {Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
import {Request} from 'express';

import {AuthGuard} from '../../../auth';

import {ItemThumbUpService} from './item-thumb-up.service';

@Controller('convention/item/thumb-up')
export class ItemThumbUpController {
  constructor(private itemThumbUpService: ItemThumbUpService) {}

  @Get(':versionId')
  @UseGuards(AuthGuard)
  async thumbUp(
    @Param('versionId') versionId: number,
    @Req() {user}: Request,
  ) {}
}
