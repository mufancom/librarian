import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';

import {
  ResourceConflictingException,
  ResourceNotFoundException,
} from '../../common/exceptions';
import {AuthGuard} from '../../core/auth';
import {
  CategoryService,
  ConventionService,
  ItemService,
} from '../../core/convention';
import {Config} from '../../utils/config';

import {EditDTO} from './@category';
import {CreateDTO} from './convention.dto';

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

  @Get('prettier-config')
  async getPrettierConfig() {
    return Config.clientPrettier.get();
  }

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateDTO) {
    let {categoryId, title, alias} = data;

    if (!(await this.categoryService.findOneById(categoryId))) {
      throw new ResourceNotFoundException('CATEGORY_NOT_FOUND');
    }

    let existedConvention = await this.conventionService.findSiblingByTitleOrAlias(
      categoryId,
      title,
      alias,
    );

    if (existedConvention) {
      if (
        title === existedConvention.title ||
        title === existedConvention.alias
      ) {
        throw new ResourceConflictingException(
          'TITLE_ALREADY_EXISTS_UNDER_SAME_PARENT',
        );
      } else {
        throw new ResourceConflictingException(
          'ALIAS_ALREADY_EXISTS_UNDER_SAME_PARENT',
        );
      }
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
    let {id, title, alias, afterOrderId} = data;

    let convention = await this.conventionService.findOneById(id);

    if (!convention) {
      throw new ResourceNotFoundException('CONVENTION_NOT_FOUND');
    }

    let existedConvention = await this.conventionService.findSiblingByTitleOrAlias(
      convention.categoryId,
      title,
      alias,
    );

    if (existedConvention) {
      if (
        title === existedConvention.title ||
        title === existedConvention.alias
      ) {
        throw new ResourceConflictingException(
          'TITLE_ALREADY_EXISTS_UNDER_SAME_PARENT',
        );
      } else {
        throw new ResourceConflictingException(
          'ALIAS_ALREADY_EXISTS_UNDER_SAME_PARENT',
        );
      }
    }

    if (
      typeof afterOrderId !== 'undefined' &&
      afterOrderId !== convention.orderId
    ) {
      convention = await this.conventionService.shift(convention, afterOrderId);
    }

    if (title) {
      convention.title = title;
    }

    if (alias) {
      convention.alias = alias;
    }

    await this.conventionService.save(convention);
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.conventionService.findOneById(id);
  }

  @Get(':id/items')
  async getItems(@Param('id') id: number) {
    return this.itemService.getItems(id);
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

  @Post('search')
  async search(@Body('keywords') keywords: string) {
    if (!keywords) {
      return {segments: [], convention: [], items: []};
    }

    let segments = this.conventionService.doSegment(keywords);

    let conventions = await this.conventionService.search(keywords, 3, 1);

    let items = await this.itemService.search(keywords, 8, 1);

    return {segments, conventions, items};
  }
}
