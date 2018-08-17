import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {Category, CategoryStatus} from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder()
      .where('status != :deleted', {deleted: CategoryStatus.deleted})
      .getMany();
  }

  async findOneById(id: number): Promise<Category | undefined> {
    return this.categoryRepository
      .createQueryBuilder()
      .where('id = :id and status != :deleted', {
        id,
        deleted: CategoryStatus.deleted,
      })
      .getOne();
  }

  async getMaxOrderId(parentId: number): Promise<number> {
    let maxOrderId = (await this.categoryRepository
      .createQueryBuilder()
      .where('parent_id = :parentId and status != :deleted', {
        parentId,
        deleted: CategoryStatus.deleted,
      })
      .select('max(order_id)')
      .execute())[0]['max(order_id)'];

    if (maxOrderId === null) {
      return -1;
    }

    return maxOrderId;
  }

  async insert(
    parentId: number,
    afterOrderId: number | undefined,
    categoryLike: DeepPartial<Category>,
  ): Promise<Category> {
    categoryLike.orderId = (await this.getMaxOrderId(parentId)) + 1;

    let category = await this.create(categoryLike);

    if (typeof afterOrderId !== 'undefined') {
      category = await this.shift(category, afterOrderId);
    }

    return category;
  }

  async shift(category: Category, afterOrderId: number): Promise<Category> {
    let maxOrderId = await this.getMaxOrderId(category.parentId);

    if (afterOrderId > maxOrderId) {
      afterOrderId = maxOrderId;
    }

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
        'parent_id = :parentId and order_id >= :theSmaller and order_id <= :theLarger and status != :deleted',
        {
          parentId,
          theSmaller,
          theLarger,
          deleted: CategoryStatus.deleted,
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

  async create(categoryLike: DeepPartial<Category>): Promise<Category> {
    categoryLike.status = CategoryStatus.normal;

    let category = this.categoryRepository.create(categoryLike);

    return this.categoryRepository.save(category);
  }

  async save(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }

  async delete(category: Category): Promise<Category> {
    await this.shift(category, await this.getMaxOrderId(category.parentId));

    category.status = CategoryStatus.deleted;
    category.deletedAt = new Date();

    return this.save(category);
  }
}
