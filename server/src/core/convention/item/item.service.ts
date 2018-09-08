import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {
  DeepPartial,
  Repository,
  Transaction,
  TransactionRepository,
} from 'typeorm';

import {splitJoinedResult} from '../../../utils/repository';
import {NotificationService} from '../../notification';
import {User} from '../../user';
import {Convention} from '../convention.entity';

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

export interface ItemVersionWithUserInfo {
  itemVersion: ItemVersion;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(ItemVersion)
    private itemVersionRepository: Repository<ItemVersion>,
    @Inject(NotificationService)
    private notificationService: NotificationService,
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

  async getItemsWithIveReadSection(): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder()
      .where('contains_iveread = 1 and status != :deleted', {
        deleted: ItemStatus.deleted,
      })
      .getMany();
  }

  async search(
    keywords: string,
    pageSize: number,
    page: number,
  ): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder()
      .where(
        'match (`content`) against (:keywords in natural language mode) and status != :deleted',
        {
          keywords,
          deleted: ItemStatus.deleted,
        },
      )
      .offset(pageSize * (page - 1))
      .take(pageSize)
      .getMany();
  }

  @Transaction()
  async createItem(
    convention: Convention,
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

    this.notificationService
      .notifyCreationOfNewConventionItem(convention, item)
      .catch(console.error);

    return item;
  }

  @Transaction()
  async editItem(
    userId: number,
    convention: Convention,
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

    let oldItem = {...item};

    item.content = content;
    item.versionId = itemVersion.id;
    item.versionHash = itemVersion.hash;
    item.versionCreatedAt = itemVersion.createdAt;

    // TODO: consistency backward check
    item = await saveItem(item, itemRepository!);

    this.notificationService
      .notifyChangesFromConvention(convention, oldItem, item)
      .catch(console.error);

    return item;
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

  async deleteItemByConventionId(conventionId: number): Promise<void> {
    let items = await this.itemRepository
      .createQueryBuilder()
      .where('convention_id = :conventionId and status != :deleted', {
        conventionId,
        deleted: ItemStatus.deleted,
      })
      .getMany();

    for (let item of items) {
      await this.deleteItem(item);
    }
  }

  @Transaction()
  async rollbackItem(
    item: Item,
    toVersion: ItemVersion,
    userId: number,
    @TransactionRepository(Item) itemRepository?: Repository<Item>,
    @TransactionRepository(ItemVersion)
    itemVersionRepository?: Repository<ItemVersion>,
  ): Promise<Item> {
    let message = `Rollback to version: ${toVersion.hash}`;

    let itemVersion = await createItemVersion(
      {...toVersion, id: undefined, fromId: toVersion.id, message, userId},
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
  ): Promise<[ItemVersionWithUserInfo[], number]> {
    let count = await itemVersionRepository
      .createQueryBuilder()
      .where('convention_item_id = :itemId', {itemId})
      .getCount();

    let mixedJoinedItems = await itemVersionRepository
      .createQueryBuilder()
      .where('convention_item_id = :itemId', {itemId})
      .orderBy('created_at', 'DESC')
      .leftJoinAndMapOne('user', User, 'User', 'User.id = user_id')
      .offset(ITEM_VERSION_PAGE_SIZE * (page - 1))
      .limit(ITEM_VERSION_PAGE_SIZE)
      .execute();

    let result: ItemVersionWithUserInfo[] = [];

    for (let mixedJoinedItem of mixedJoinedItems) {
      let {left: itemVersion, right: user} = splitJoinedResult<
        ItemVersion,
        User
      >('ItemVersion', 'User', mixedJoinedItem);

      let {id, username, email} = user;

      result.push({
        itemVersion,
        user: {id, username, email},
      });
    }

    return [result, count];
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
