import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import Segment from 'segment';
import {DeepPartial, Repository} from 'typeorm';

import {Convention, ConventionStatus, ItemService} from '../../core/convention';

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
  segment: Segment;

  constructor(
    @InjectRepository(Convention)
    private conventionRepository: Repository<Convention>,
    @Inject(ItemService) private itemService: ItemService,
  ) {
    this.segment = new Segment();

    this.segment.useDefault();
  }

  doSegment(text: string): string[] {
    let segmentItems = this.segment.doSegment(text, {stripPunctuation: true});

    let result: string[] = [];

    for (let item of segmentItems) {
      result.push(item.w);
    }

    return result;
  }

  async getConventions(): Promise<Convention[]> {
    return this.conventionRepository
      .createQueryBuilder()
      .where('status != :deleted', {
        deleted: ConventionStatus.deleted,
      })
      .getMany();
  }

  async findOneById(id: number): Promise<Convention | undefined> {
    return this.conventionRepository
      .createQueryBuilder()
      .where('id = :id and status != :deleted', {
        id,
        deleted: ConventionStatus.deleted,
      })
      .getOne();
  }

  async search(
    keywords: string,
    pageSize: number,
    page: number,
  ): Promise<Convention[]> {
    let result = await this.conventionRepository
      .createQueryBuilder()
      .where(
        'match (`title`, `alias`) against (:keywords in natural language mode) and status != :deleted',
        {
          keywords,
          deleted: ConventionStatus.deleted,
        },
      )
      .offset(pageSize * (page - 1))
      .take(pageSize)
      .getMany();

    if (!result.length) {
      result = await this.conventionRepository
        .createQueryBuilder()
        .where('title like :keywords and status != :deleted', {
          keywords: `%${keywords}%`,
          deleted: ConventionStatus.deleted,
        })
        .offset(pageSize * (page - 1))
        .take(pageSize)
        .getMany();
    }

    return result;
  }

  async findSiblingByTitleOrAlias(
    categoryId: number,
    title?: string,
    alias?: string,
    thisId?: number,
  ): Promise<Convention | undefined> {
    let checkNameSQL = 'false';

    if (title) {
      checkNameSQL = 'title = :title or alias = :title';
    }

    if (alias) {
      checkNameSQL += ' or title = :alias or alias = :alias';
    }

    let checkIdSQL = '';

    if (thisId) {
      checkIdSQL = 'and id != :thisId';
    }

    let sql = `category_id = :categoryId and status != :deleted ${checkIdSQL} and (${checkNameSQL})`;

    return this.conventionRepository
      .createQueryBuilder()
      .where(sql, {
        categoryId,
        title,
        alias,
        deleted: ConventionStatus.deleted,
      })
      .getOne();
  }

  async getMaxOrderId(categoryId: number): Promise<number> {
    let maxOrderId = (await this.conventionRepository
      .createQueryBuilder()
      .where('category_id = :categoryId and status != :deleted', {
        categoryId,
        deleted: ConventionStatus.deleted,
      })
      .select('max(order_id)')
      .execute())[0]['max(order_id)'];

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
    conventionLike.orderId = (await this.getMaxOrderId(categoryId)) + 1;

    let convention = await this.create(conventionLike);

    if (typeof afterOrderId !== 'undefined') {
      convention = await this.shift(convention, afterOrderId);
    }

    return convention;
  }

  async shift(
    convention: Convention,
    afterOrderId: number,
  ): Promise<Convention> {
    let maxOrderId = await this.getMaxOrderId(convention.categoryId);

    if (afterOrderId > maxOrderId) {
      afterOrderId = maxOrderId;
    }

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
        'category_id = :categoryId and order_id >= :theSmaller and order_id <= :theLarger and status != :deleted',
        {
          categoryId,
          theSmaller,
          theLarger,
          deleted: ConventionStatus.deleted,
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

  async create(conventionLike: DeepPartial<Convention>): Promise<Convention> {
    let convention = this.conventionRepository.create(conventionLike);

    convention.status = ConventionStatus.normal;

    return this.conventionRepository.save(convention);
  }

  async save(convention: Convention): Promise<Convention> {
    return this.conventionRepository.save(convention);
  }

  async delete(convention: Convention): Promise<Convention> {
    await this.shift(
      convention,
      await this.getMaxOrderId(convention.categoryId),
    );

    convention.status = ConventionStatus.deleted;
    convention.deletedAt = new Date();

    await this.itemService.deleteItemByConventionId(convention.id);

    return this.conventionRepository.save(convention);
  }

  async deleteByCategory(categoryId: number): Promise<void> {
    let conventions = await this.conventionRepository
      .createQueryBuilder()
      .where('category_id = :categoryId and state = :deleted', {
        categoryId,
        deleted: ConventionStatus.deleted,
      })
      .getMany();

    for (let convention of conventions) {
      await this.delete(convention);
    }
  }
}
