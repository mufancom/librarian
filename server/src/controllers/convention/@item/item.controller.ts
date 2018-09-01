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
  ResourceConflictingException,
  ResourceNotFoundException,
  UnnecessaryRequestException,
} from '../../../common/exceptions';
import {AuthGuard} from '../../../core/auth';
import {
  ConventionService,
  ITEM_VERSION_PAGE_SIZE,
  ItemService,
} from '../../../core/convention';

import {CreateDTO, EditDTO, RollbackDTO, ShiftDTO} from './item.dto';

@Controller('convention/item')
export class ItemController {
  constructor(
    @Inject(ItemService) private itemService: ItemService,
    @Inject(ConventionService) private conventionService: ConventionService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateDTO, @Req() {user}: Request) {
    let convention = await this.conventionService.findOneById(
      data.conventionId,
    );

    if (!convention) {
      throw new ResourceNotFoundException('CONVENTION_NOT_FOUND');
    }

    let {conventionId, afterOrderId, message} = data;

    let {id} = await this.itemService.createItem(
      convention,
      user.id,
      conventionId,
      afterOrderId,
      message,
      data,
    );

    return {id};
  }

  @Post('edit')
  @UseGuards(AuthGuard)
  async edit(@Body() data: EditDTO, @Req() {user}: Request) {
    let item = await this.itemService.getItemById(data.id);

    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    let convention = await this.conventionService.findOneById(
      item.conventionId,
    );

    if (!convention) {
      throw new ResourceNotFoundException('CONVENTION_NOT_FOUND');
    }

    let {fromVersionId, content, message} = data;

    if (item.versionId !== fromVersionId) {
      throw new ResourceConflictingException('BASE_VERSION_OUT_DATED');
    }

    let {versionId} = await this.itemService.editItem(
      user.id,
      convention,
      item,
      fromVersionId,
      content,
      message,
    );

    return {versionId};
  }

  @Post('shift')
  @UseGuards(AuthGuard)
  async shift(@Body() data: ShiftDTO) {
    let item = await this.itemService.getItemById(data.id);

    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    await this.itemService.shiftItem(item, data.afterOrderId);
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.itemService.getItemById(id);
  }

  @Get(':id/versions')
  async getVersions(@Param('id') id: number, @Query('page') page = 1) {
    let [versions, count] = await this.itemService.getItemVersionsByItemId(
      id,
      page,
    );

    let pageCount = Math.ceil(count / ITEM_VERSION_PAGE_SIZE);

    return {versions, pageCount};
  }

  @Get(':id/delete')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    let item = await this.itemService.getItemById(id);

    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    await this.itemService.deleteItem(item);
  }

  @Post('rollback')
  @UseGuards(AuthGuard)
  async rollback(@Body() data: RollbackDTO, @Req() {user}: Request) {
    let itemVersion = await this.itemService.getItemVersionById(
      data.toVersionId,
    );

    if (!itemVersion) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_VERSION_NOT_FOUND');
    }

    let item = await this.itemService.getItemById(itemVersion.conventionItemId);

    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    if (item.versionId === itemVersion.id) {
      throw new UnnecessaryRequestException(
        'CANNOT_ROLLBACK_TO_CURRENT_VERSION',
      );
    }

    await this.itemService.rollbackItem(item, itemVersion, user.id);
  }
}
