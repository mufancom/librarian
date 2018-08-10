import {Body, Controller, Get, Param, Post} from '@nestjs/common';

import {ResourceNotFoundException} from 'common/exceptions';

import {CreateDTO, EditDTO} from './category.dto';
import {CategoryService} from './category.service';

@Controller('convention/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('create')
  async create(@Body() data: CreateDTO) {
    let {parentId, afterOrderId} = data;

    if (parentId !== 0 && !(await this.categoryService.findById(parentId))) {
      throw new ResourceNotFoundException('PARENT_CATEGORY_NOT_FOUND');
    }

    let category = await this.categoryService.insert(
      parentId,
      afterOrderId,
      data,
    );

    return {id: category.id};
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

    await this.categoryService.save(category);
  }

  @Get('delete/:id')
  async delete(@Param() id: number) {
    let category = await this.categoryService.findById(id);

    if (!category) {
      throw new ResourceNotFoundException('CATEGORY_NOT_FOUND');
    }

    await this.categoryService.delete(category);
  }
}
