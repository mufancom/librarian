import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {Item} from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async findOneById(id: number): Promise<Item | undefined> {
    return this.itemRepository
      .createQueryBuilder()
      .where('id = :id and status != 0', {id})
      .getOne();
  }

  async getItems(conventionId: number): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder()
      .where('convention_id = :conventionId and status = 1', {conventionId})
      .getMany();
  }

  async getMaxOrderId(conventionId: number): Promise<number> {
    let maxOrderId = (await this.itemRepository
      .createQueryBuilder()
      .where('convention_id = :conventionId and status != 0', {conventionId})
      .select('max(order_id)')
      .execute())['max(order_id)'];

    if (maxOrderId === null) {
      return -1;
    }

    return maxOrderId;
  }

  async insert(
    conventionId: number,
    afterOrderId: number | undefined,
    itemLike: DeepPartial<Item>,
  ): Promise<Item> {
    itemLike.orderId = (await this.getMaxOrderId(conventionId)) + 1;

    let item = await this.itemRepository.create(itemLike);

    if (typeof afterOrderId !== 'undefined') {
      item = await this.shift(item, afterOrderId);
    }

    return item;
  }

  async shift(item: Item, afterOrderId: number): Promise<Item> {
    let {orderId: previousOrderId, conventionId} = item;
    let theSmaller = Math.min(previousOrderId, afterOrderId);
    let theLarger = Math.max(previousOrderId, afterOrderId);

    let leftShift = false;

    if (theSmaller === afterOrderId) {
      theSmaller += 1;
      leftShift = true;
    }

    let affectedItems = await this.itemRepository
      .createQueryBuilder()
      .where(
        'convention_id = :conventionId and order_id >= :theSmaller and order_id <= :theLarger and status != 0',
        {
          conventionId,
          theSmaller,
          theLarger,
        },
      )
      .getMany();

    for (let affectedItem of affectedItems) {
      if (affectedItem.id !== item.id) {
        affectedItem.orderId += leftShift ? 1 : -1;
      } else {
        affectedItem.orderId = afterOrderId + (leftShift ? 1 : 0);
        item = affectedItem;
      }
    }

    await this.itemRepository.save(affectedItems);

    return item;
  }

  async delete(item: Item): Promise<Item> {
    item.status = 0;
    return this.itemRepository.save(item);
  }

  async save(item: Item): Promise<Item> {
    return this.itemRepository.save(item);
  }
}
