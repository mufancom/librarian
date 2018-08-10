import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {Category} from './category.entity';

@Injectable()
export class ConventionCategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder()
      .where('status != 0')
      .getMany();
  }

  async findById(id: number): Promise<Category | undefined> {
    return this.categoryRepository
      .createQueryBuilder()
      .where('id = :id', {id})
      .getOne();
  }

  async maxOrderId(parentId: number): Promise<number> {
    let maxOrderId = (await this.categoryRepository
      .createQueryBuilder()
      .where('parent_id = :parentId', {parentId})
      .select('max(order_id)')
      .execute())['max(order_id'];

    if (maxOrderId === null) {
      return -1;
    }

    return maxOrderId;
  }

  async insert(
    parentId: number,
    afterOrderId: number | undefined,
    categoryLike: DeepPartial<Category>,
  ) {
    categoryLike.orderId = (await this.maxOrderId(parentId)) + 1;

    let category = await this.categoryRepository.create(categoryLike);

    if (typeof afterOrderId !== 'undefined') {
      category = await this.shift(category, afterOrderId);
    }

    return category;
  }

  async shift(category: Category, afterOrderId: number): Promise<Category> {
    let {orderId: previousOrderId, parentId} = category;
    let theSmaller = Math.min(previousOrderId, afterOrderId);
    let theLarger = Math.max(previousOrderId, afterOrderId);

    let leftShift = false;

    if (theSmaller === afterOrderId) {
      theSmaller += 1;
      leftShift = true;
    }

    let affectedCategories = await this.categoryRepository
      .createQueryBuilder()
      .where(
        'parent_id = :parentId and order_id >= :theSmaller and order_id <= :theLarger',
        {
          parentId,
          theSmaller,
          theLarger,
        },
      )
      .getMany();

    for (let affectedCategory of affectedCategories) {
      if (affectedCategory.id !== category.id) {
        affectedCategory.orderId += leftShift ? 1 : -1;
      } else {
        affectedCategory.orderId = afterOrderId + (leftShift ? 1 : 0);
        category = affectedCategory;
      }
    }

    await this.categoryRepository.save(affectedCategories);

    return category;
  }

  async save(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }
}
