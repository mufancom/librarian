import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';

import {
  ResourceConflictingException,
  ResourceNotFoundException,
  UnnecessaryRequestException,
} from 'common/exceptions';

import {ConventionService} from '../convention.service';

import {CreateDTO, EditDTO, RollbackDTO, ShiftDTO} from './item.dto';
import {ItemService} from './item.service';

@Controller('convention/item')
export class ItemController {
  constructor(
    private itemService: ItemService,
    private conventionService: ConventionService,
  ) {}

  @Post('create')
  async create(@Body() data: CreateDTO) {
    if (!(await this.conventionService.findOneById(data.conventionId))) {
      throw new ResourceNotFoundException('CONVENTION_NOT_FOUND');
    }

    let {conventionId, afterOrderId} = data;

    let {id} = await this.itemService.createItem(
      conventionId,
      afterOrderId,
      data.message,
      data,
    );

    return {id};
  }

  @Post('edit')
  async edit(@Body() data: EditDTO) {
    let item = await this.itemService.getItemById(data.id);

    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    let {fromVersionId, content, message} = data;

    if (item.versionId !== fromVersionId) {
      throw new ResourceConflictingException('BASE_VERSION_OUT_DATED');
    }

    let {versionId} = await this.itemService.editItem(
      item,
      fromVersionId,
      content,
      message,
    );

    return {versionId};
  }

  @Post('shift')
  async shift(@Body() data: ShiftDTO) {
    let item = await this.itemService.getItemById(data.id);
    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    await this.itemService.shiftItem(item, data.afterOrderId);
  }

  @Get('delete/:id')
  async delete(@Param('id') id: number) {
    let item = await this.itemService.getItemById(id);
    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    await this.itemService.deleteItem(item);
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.itemService.getItemById(id);
  }

  @Get(':id/versions')
  async getVersions(@Param('id') id: number, @Query('page') page = 1) {
    return this.itemService.getItemVersionsByItemId(id, page);
  }

  @Post('rollback')
  async rollback(@Body() data: RollbackDTO) {
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

    await this.itemService.rollbackItem(item, itemVersion);
  }
}
