import {Body, Controller, Get, Post} from '@nestjs/common';

import {ResourceNotFoundException} from 'common/exceptions';

import {CreateDTO, EditDTO} from './category.dto';
import {ConventionCategoryService} from './category.service';

@Controller('convention/category')
export class ConventionCategoryController {
  constructor(private categoryService: ConventionCategoryService) {}

  @Post('create')
  async create(@Body() data: CreateDTO) {
    let {parentId, afterOrderId} = data;
    if (parentId !== 0 && !(await this.categoryService.findById(parentId))) {
      throw new ResourceNotFoundException('PARENT_CATEGORY_NOT_FOUND');
    }

    return this.categoryService.insert(parentId, afterOrderId, data);
  }

  @Post('edit')
  async edit(@Body() data: EditDTO) {
    let category = await this.categoryService.findById(data.id);
    if (!category) {
      throw new ResourceNotFoundException('CATEGORY_NOT_FOUND');
    }

    let {afterOrderId} = data;

    if (
      typeof afterOrderId !== 'undefined' &&
      afterOrderId !== category.orderId
    ) {
      category = await this.categoryService.shift(category, afterOrderId);
    }

    let {title, alias} = data;

    if (title) {
      category.title = title;
    }
    if (alias) {
      category.alias = alias;
    }

    return this.categoryService.save(category);
  }
}
