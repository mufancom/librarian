import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Item, ItemStatus, ItemVersion} from 'shared/entities/convention/item';
import {
  DeepPartial,
  Repository,
  Transaction,
  TransactionRepository,
} from 'typeorm';

import {
  createItemVersion,
  insertItem,
  saveItem,
  saveItemVersion,
  shiftItem,
} from './item-repository-utils';

const ITEM_VERSION_PAGE_SIZE = 20;

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
      .getMany();
  }

  @Transaction()
  async createItem(
    conventionId: number,
    afterOrderId: number | undefined,
    message: string | undefined,
    itemLike: DeepPartial<Item>,
    @TransactionRepository(Item) itemRepository?: Repository<Item>,
    @TransactionRepository(ItemVersion)
    itemVersionRepository?: Repository<ItemVersion>,
  ): Promise<Item> {
    let itemVersion = await createItemVersion(
      {content: itemLike.content, message},
      itemVersionRepository!,
    );

    itemLike.versionId = itemVersion.id;

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
      },
      itemVersionRepository!,
    );

    item.content = content;
    item.versionId = itemVersion.id;

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
    let now = Date.now();

    item.status = ItemStatus.deleted;
    item.deletedAt = now;

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
  ): Promise<ItemVersion[]> {
    return itemVersionRepository
      .createQueryBuilder()
      .where('convention_item_id = :itemId', {itemId})
      .offset(ITEM_VERSION_PAGE_SIZE * (page - 1))
      .take(ITEM_VERSION_PAGE_SIZE)
      .getMany();
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
