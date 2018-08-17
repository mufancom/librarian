import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';

import {ResourceNotFoundException} from 'common/exceptions';

import {AuthGuard} from '../auth';

import {CategoryService, EditDTO} from './@category';
import {ItemService} from './@item';
import {CreateDTO} from './convention.dto';
import {ConventionService} from './convention.service';

@Controller('convention')
export class ConventionController {
  constructor(
    private conventionService: ConventionService,
    private categoryService: CategoryService,
    private itemService: ItemService,
  ) {}

  @Get('index')
  async getIndex() {
    return {
      categories: await this.categoryService.getCategories(),
      conventions: await this.conventionService.getConventions(),
    };
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.conventionService.findOneById(id);
  }

  @Get(':id/items')
  async getItems(@Param('id') id: number) {
    return this.itemService.getItems(id);
  }

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateDTO) {
    if (!(await this.categoryService.findOneById(data.categoryId))) {
      throw new ResourceNotFoundException('CATEGORY_NOT_FOUND');
    }

    let {id} = await this.conventionService.insert(
      data.categoryId,
      data.afterOrderId,
      data,
    );

    return {id};
  }

  @Post('edit')
  @UseGuards(AuthGuard)
  async edit(@Body() data: EditDTO) {
    let convention = await this.conventionService.findOneById(data.id);
    if (!convention) {
      throw new ResourceNotFoundException('CONVENTION_NOT_FOUND');
    }

    let {afterOrderId} = data;

    if (
      typeof afterOrderId !== 'undefined' &&
      afterOrderId !== convention.orderId
    ) {
      convention = await this.conventionService.shift(convention, afterOrderId);
    }

    let {title, alias} = data;

    if (title) {
      convention.title = title;
    }

    if (alias) {
      convention.alias = alias;
    }

    await this.conventionService.save(convention);
  }

  @Get(':id/delete')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    let convention = await this.conventionService.findOneById(id);

    if (!convention) {
      throw new ResourceNotFoundException('CONVENTION_NOT_FOUND');
    }

    await this.conventionService.delete(convention);
  }
}
