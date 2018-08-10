import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {Convention} from './convention.entity';

export interface IndexTree {
  title: string;
  path?: string;
  children?: IndexTree[];
}

export interface IndexJSON {
  [key: string]: string | IndexJSON;
}

@Injectable()
export class ConventionService {
  constructor(
    @InjectRepository(Convention)
    private conventionRepository: Repository<Convention>,
  ) {}

  async getConventions(): Promise<Convention[]> {
    return this.conventionRepository.find();
  }

  async findOneById(id: number): Promise<Convention | undefined> {
    return this.conventionRepository
      .createQueryBuilder()
      .where('id = :id and status != 0', {id})
      .getOne();
  }

  async getMaxOrderId(categoryId: number): Promise<number> {
    let maxOrderId = (await this.conventionRepository
      .createQueryBuilder()
      .where('category_id = :categoryId', {categoryId})
      .select('max(order_id)')
      .execute())['max(order_id)'];

    if (maxOrderId === null) {
      return -1;
    }

    return maxOrderId;
  }

  async insert(
    categoryId: number,
    afterOrderId: number | undefined,
    conventionLike: DeepPartial<Convention>,
  ): Promise<Convention> {
    conventionLike.categoryId = (await this.getMaxOrderId(categoryId)) + 1;

    let convention = await this.conventionRepository.create(conventionLike);

    if (typeof afterOrderId !== 'undefined') {
      convention = await this.shift(convention, afterOrderId);
    }

    return convention;
  }

  async shift(
    convention: Convention,
    afterOrderId: number,
  ): Promise<Convention> {
    let {orderId: previousOrderId, categoryId} = convention;
    let theSmaller = Math.min(previousOrderId, afterOrderId);
    let theLarger = Math.max(previousOrderId, afterOrderId);

    let leftShift = false;

    if (theSmaller === afterOrderId) {
      theSmaller += 1;
      leftShift = true;
    }

    let affectedConventions = await this.conventionRepository
      .createQueryBuilder()
      .where(
        'category_id = :categoryId and order_id >= :theSmaller and order_id <= :theLarger',
        {
          categoryId,
          theSmaller,
          theLarger,
        },
      )
      .getMany();

    for (let affectedConvention of affectedConventions) {
      if (affectedConvention.id !== convention.id) {
        affectedConvention.orderId += leftShift ? 1 : -1;
      } else {
        affectedConvention.orderId = afterOrderId + (leftShift ? 1 : 0);
        convention = affectedConvention;
      }
    }

    await this.conventionRepository.save(affectedConventions);

    return convention;
  }

  async save(convention: Convention): Promise<Convention> {
    return this.conventionRepository.save(convention);
  }

  async delete(convention: Convention): Promise<Convention> {
    convention.status = 0;
    return this.conventionRepository.save(convention);
  }
}
