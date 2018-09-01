import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ResourceConflictingException,
  ResourceNotFoundException,
} from '../../../common/exceptions';
import {AuthGuard} from '../../../core/auth';
import {CategoryService} from '../../../core/convention';

import {CreateDTO, EditDTO} from './category.dto';

@Controller('convention/category')
export class CategoryController {
  constructor(
    @Inject(CategoryService) private categoryService: CategoryService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateDTO) {
    let {parentId, afterOrderId, title, alias} = data;

    if (parentId !== 0 && !(await this.categoryService.findOneById(parentId))) {
      throw new ResourceNotFoundException('PARENT_CATEGORY_NOT_FOUND');
    }

    let existedCategory = await this.categoryService.findSiblingByTitleOrAlias(
      parentId,
      title,
      alias,
    );

    if (existedCategory) {
      if (title === existedCategory.title || title === existedCategory.alias) {
        throw new ResourceConflictingException(
          'TITLE_ALREADY_EXISTS_UNDER_SAME_PARENT',
        );
      } else {
        throw new ResourceConflictingException(
          'ALIAS_ALREADY_EXISTS_UNDER_SAME_PARENT',
        );
      }
    }

    let {id} = await this.categoryService.insert(parentId, afterOrderId, data);

    return {id};
  }

  @Post('edit')
  @UseGuards(AuthGuard)
  async edit(@Body() data: EditDTO) {
    let {id, title, alias, afterOrderId} = data;

    let category = await this.categoryService.findOneById(id);

    if (!category) {
      throw new ResourceNotFoundException('CATEGORY_NOT_FOUND');
    }

    let existedCategory = await this.categoryService.findSiblingByTitleOrAlias(
      category.parentId,
      title,
      alias,
    );

    if (existedCategory) {
      if (title === existedCategory.title || title === existedCategory.alias) {
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
      afterOrderId !== category.orderId
    ) {
      category = await this.categoryService.shift(category, afterOrderId);
    }

    if (title) {
      category.title = title;
    }

    if (alias) {
      category.alias = alias;
    }

    await this.categoryService.save(category);
  }

  @Get(':id/delete')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    let category = await this.categoryService.findOneById(id);

    if (!category) {
      throw new ResourceNotFoundException('CATEGORY_NOT_FOUND');
    }

    await this.categoryService.delete(category);
  }
}
