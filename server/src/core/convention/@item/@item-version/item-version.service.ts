import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {ItemVersion} from './item-version.entity';

@Injectable()
export class ItemVersionService {
  constructor(
    @InjectRepository(ItemVersion)
    private itemVersionRepository: Repository<ItemVersion>,
  ) {}

  async findOneById(id: number): Promise<ItemVersion | undefined> {
    return this.itemVersionRepository
      .createQueryBuilder()
      .where('id = :id and status = 1', {id})
      .getOne();
  }

  async getManyByItemId(itemId: number): Promise<ItemVersion[]> {
    return this.itemVersionRepository
      .createQueryBuilder()
      .where('convention_item_id = :itemId', {itemId})
      .getMany();
  }

  async create(itemVersionLike: DeepPartial<ItemVersion>) {
    let now = Date.now();

    itemVersionLike.fromId = 0;
    itemVersionLike.createdAt = now;
    itemVersionLike.commentCount = 0;
    itemVersionLike.thumbUpCount = 0;

    return this.itemVersionRepository.create(itemVersionLike);
  }

  async save(itemVersion: ItemVersion): Promise<ItemVersion> {
    return this.itemVersionRepository.save(itemVersion);
  }
}
