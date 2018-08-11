import {Body, Controller, Get, Param, Post} from '@nestjs/common';

import {ResourceNotFoundException} from 'common/exceptions';

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
    return this.itemService.getItems(id);
  }

  @Post('create')
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

  @Get('delete/:id')
  async delete(@Param('id') id: number) {
    let category = await this.categoryService.findOneById(id);
    if (!category) {
      throw new ResourceNotFoundException('CATEGORY_NOT_FOUND');
    }

    await this.categoryService.delete(category);
  }
}
