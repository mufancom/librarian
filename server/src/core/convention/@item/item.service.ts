import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {
  DeepPartial,
  Repository,
  Transaction,
  TransactionRepository,
} from 'typeorm';

import {
  createItemVersion,
  getItemMaxOrderId,
  insertItem,
  saveItem,
  saveItemVersion,
  shiftItem,
} from './item-repository-utils';
import {ItemVersion} from './item-version.entity';
import {Item, ItemStatus} from './item.entity';

export const ITEM_VERSION_PAGE_SIZE = 20;

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(ItemVersion)
    private itemVersionRepository: Repository<ItemVersion>,
  ) {}

  async getItemById(id: number): Promise<Item | undefined> {
    return this.itemRepository
      .createQueryBuilder()
      .where('id = :id and status != :deleted', {
        id,
        deleted: ItemStatus.deleted,
      })
      .getOne();
  }

  async getItems(conventionId: number): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder()
      .where('convention_id = :conventionId and status != :deleted', {
        conventionId,
        deleted: ItemStatus.deleted,
      })
      .orderBy('order_id')
      .getMany();
  }

  @Transaction()
  async createItem(
    userId: number,
    conventionId: number,
    afterOrderId: number | undefined,
    message: string | undefined,
    itemLike: DeepPartial<Item>,
    @TransactionRepository(Item) itemRepository?: Repository<Item>,
    @TransactionRepository(ItemVersion)
    itemVersionRepository?: Repository<ItemVersion>,
  ): Promise<Item> {
    let itemVersion = await createItemVersion(
      {
        content: itemLike.content,
        message,
        conventionItemId: 0,
        userId,
      },
      itemVersionRepository!,
    );

    itemLike.versionId = itemVersion.id;
    itemLike.versionHash = itemVersion.hash;
    itemLike.versionCreatedAt = itemVersion.createdAt;

    let item = await insertItem(
      conventionId,
      afterOrderId,
      itemLike,
      itemRepository!,
    );

    itemVersion.conventionItemId = item.id;
    await saveItemVersion(itemVersion, itemVersionRepository!);

    return item;
  }

  @Transaction()
  async editItem(
    userId: number,
    item: Item,
    fromVersionId: number,
    content: string,
    message: string | undefined,
    @TransactionRepository(Item) itemRepository?: Repository<Item>,
    @TransactionRepository(ItemVersion)
    itemVersionRepository?: Repository<ItemVersion>,
  ): Promise<Item> {
    let itemVersion = await createItemVersion(
      {
        conventionItemId: item.id,
        content,
        fromId: fromVersionId,
        message,
        userId,
      },
      itemVersionRepository!,
    );

    item.content = content;
    item.versionId = itemVersion.id;
    item.versionHash = itemVersion.hash;
    item.versionCreatedAt = itemVersion.createdAt;

    // TODO: consistency backward check
    return saveItem(item, itemRepository!);
  }

  @Transaction()
  async shiftItem(
    item: Item,
    afterOrderId: number,
    @TransactionRepository(Item) itemRepository?: Repository<Item>,
  ): Promise<Item> {
    return shiftItem(item, afterOrderId, itemRepository!);
  }

  async deleteItem(
    item: Item,
    itemRepository: Repository<Item> = this.itemRepository,
  ): Promise<Item> {
    await shiftItem(
      item,
      await getItemMaxOrderId(item.conventionId, itemRepository),
      itemRepository,
    );

    item.status = ItemStatus.deleted;
    item.deletedAt = new Date();

    return itemRepository.save(item);
  }

  @Transaction()
  async rollbackItem(
    item: Item,
    toVersion: ItemVersion,
    @TransactionRepository(Item) itemRepository?: Repository<Item>,
    @TransactionRepository(ItemVersion)
    itemVersionRepository?: Repository<ItemVersion>,
  ): Promise<Item> {
    let message = `Rollback to version: ${toVersion.id}`;

    let itemVersion = await createItemVersion(
      {...toVersion, id: undefined, fromId: toVersion.id, message},
      itemVersionRepository!,
    );

    item.content = toVersion.content;
    item.versionId = itemVersion.id;

    // TODO: consistency backward check
    return saveItem(item, itemRepository!);
  }

  async getItemVersionById(
    id: number,
    itemVersionRepository: Repository<ItemVersion> = this.itemVersionRepository,
  ): Promise<ItemVersion | undefined> {
    return itemVersionRepository
      .createQueryBuilder()
      .where('id = :id', {id})
      .getOne();
  }

  async getItemVersionsByItemId(
    itemId: number,
    page: number,
    itemVersionRepository: Repository<ItemVersion> = this.itemVersionRepository,
  ): Promise<[ItemVersion[], number]> {
    return itemVersionRepository
      .createQueryBuilder()
      .where('convention_item_id = :itemId', {itemId})
      .orderBy('created_at', 'DESC')
      .skip(ITEM_VERSION_PAGE_SIZE * (page - 1))
      .take(ITEM_VERSION_PAGE_SIZE)
      .getManyAndCount();
  }

  async increaseItemVersionCommentCount(
    versionId: number,
    value: number = 1,
  ): Promise<void> {
    await this.itemVersionRepository.increment(
      {id: versionId},
      'commentCount',
      value,
    );
  }

  async decreaseItemVersionCommentCount(
    versionId: number,
    value: number = 1,
  ): Promise<void> {
    await this.itemVersionRepository.decrement(
      {id: versionId},
      'commentCount',
      value,
    );
  }

  async increaseItemVersionThumbUpCount(
    versionId: number,
    value: number = 1,
  ): Promise<void> {
    await this.itemVersionRepository.increment(
      {id: versionId},
      'thumbUpCount',
      value,
    );
  }

  async decreaseItemVersionThumbUpCount(
    versionId: number,
    value: number = 1,
  ): Promise<void> {
    await this.itemVersionRepository.decrement(
      {id: versionId},
      'thumbUpCount',
      value,
    );
  }
}
