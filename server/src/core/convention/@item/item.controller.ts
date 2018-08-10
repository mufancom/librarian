import {Body, Controller, Get, Param, Post} from '@nestjs/common';

import {
  ResourceConflictingException,
  ResourceNotFoundException,
} from 'common/exceptions';

import {ConventionService} from '../convention.service';

import {ItemVersionService} from './@item-version';
import {CreateDTO, EditDTO, RollbackDTO, ShiftDTO} from './item.dto';
import {ItemService} from './item.service';

@Controller('convention/item')
export class ItemController {
  constructor(
    private itemService: ItemService,
    private itemVersionService: ItemVersionService,
    private conventionService: ConventionService,
  ) {}

  @Post('create')
  async create(@Body() data: CreateDTO) {
    if (!(await this.conventionService.findOneById(data.conventionId))) {
      throw new ResourceNotFoundException('CONVENTION_NOT_FOUND');
    }

    let {content} = data;
    let itemVersion = await this.itemVersionService.create({content});

    data.versionId = itemVersion.id;
    let item = await this.itemService.insert(
      data.conventionId,
      data.afterOrderId,
      data,
    );

    itemVersion.conventionItemId = item.id;
    await this.itemVersionService.save(itemVersion);

    return {id: item.id};
  }

  @Post('edit')
  async edit(@Body() data: EditDTO) {
    let item = await this.itemService.findOneById(data.id);

    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    if (item.versionId !== data.fromVersionId) {
      throw new ResourceConflictingException('BASE_VERSION_OUT_DATED');
    }

    let itemVersion = await this.itemVersionService.create({
      conventionItemId: item.id,
      content: data.content,
      fromId: data.fromVersionId,
    });

    item.content = data.content;
    item.versionId = itemVersion.id;

    await this.itemService.save(item);
  }

  @Post('shift')
  async shift(@Body() data: ShiftDTO) {
    let item = await this.itemService.findOneById(data.id);
    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    await this.itemService.shift(item, data.afterOrderId);
  }

  @Get('delete/:id')
  async delete(@Param('id') id: number) {
    let item = await this.itemService.findOneById(id);
    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    await this.itemService.delete(item);
  }

  @Get(':id/versions')
  async versions(@Param('id') id: number) {
    return this.itemVersionService.getManyByItemId(id);
  }

  @Post('rollback')
  async rollback(@Body() data: RollbackDTO) {
    let itemVersion = await this.itemVersionService.findOneById(
      data.toVersionId,
    );

    if (!itemVersion) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_VERSION_NOT_FOUND');
    }

    let item = await this.itemService.findOneById(itemVersion.conventionItemId);

    if (!item) {
      throw new ResourceNotFoundException('CONVENTION_ITEM_NOT_FOUND');
    }

    item.content = itemVersion.content;
    item.versionId = itemVersion.id;

    await this.itemService.save(item);
  }
}
