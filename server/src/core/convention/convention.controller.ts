import {Body, Controller, Get, Param, Post} from '@nestjs/common';

import {ResourceNotFoundException} from 'common/exceptions';

import {ConventionCategoryService} from './@category';
import {ConventionItemService} from './@item';
import {CreateDTO} from './convention.dto';
import {ConventionService} from './convention.service';

@Controller('convention')
export class ConventionController {
  constructor(
    private conventionService: ConventionService,
    private categoryService: ConventionCategoryService,
    private itemService: ConventionItemService,
  ) {}

  @Get('index')
  async index() {
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
    if (await this.categoryService.findById(data.categoryId)) {
      throw new ResourceNotFoundException('CATEGORY_NOT_FOUND');
    }

    return this.conventionService.create({...data, status: 1});
  }
}
