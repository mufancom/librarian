import {DeepPartial, Repository} from 'typeorm';

import {ItemVersion} from './item-version.entity';
import {Item, ItemStatus} from './item.entity';

export async function getItemMaxOrderId(
  conventionId: number,
  itemRepository: Repository<Item>,
) {
  let maxOrderId = (await itemRepository
    .createQueryBuilder()
    .where('convention_id = :conventionId and status != :deleted', {
      conventionId,
      deleted: ItemStatus.deleted,
    })
    .select('max(order_id)')
    .execute())[0]['max(order_id)'];

  if (maxOrderId === null) {
    return -1;
  }

  return maxOrderId;
}

export async function createItem(
  itemLike: DeepPartial<Item>,
  itemRepository: Repository<Item>,
): Promise<Item> {
  let now = Date.now();

  itemLike.status = 1;
  itemLike.createdAt = now;
  itemLike.commentCount = 0;
  itemLike.thumbUpCount = 0;

  let item = itemRepository.create(itemLike);

  return itemRepository.save(item);
}

export async function insertItem(
  conventionId: number,
  afterOrderId: number | undefined,
  itemLike: DeepPartial<Item>,
  itemRepository: Repository<Item>,
): Promise<Item> {
  itemLike.orderId =
    (await getItemMaxOrderId(conventionId, itemRepository)) + 1;

  let item = await createItem(itemLike, itemRepository);

  if (typeof afterOrderId !== 'undefined') {
    item = await shiftItem(item, afterOrderId, itemRepository);
  }

  return item;
}

export async function shiftItem(
  item: Item,
  afterOrderId: number,
  itemRepository: Repository<Item>,
): Promise<Item> {
  let {orderId: previousOrderId, conventionId} = item;
  let theSmaller = Math.min(previousOrderId, afterOrderId);
  let theLarger = Math.max(previousOrderId, afterOrderId);

  let leftShift = false;

  if (theSmaller === afterOrderId) {
    theSmaller += 1;
    leftShift = true;
  }

  let affectedItems = await itemRepository
    .createQueryBuilder()
    .where(
      'convention_id = :conventionId and order_id >= :theSmaller and order_id <= :theLarger and status != :deleted',
      {
        conventionId,
        theSmaller,
        theLarger,
        deleted: ItemStatus.deleted,
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

  await itemRepository.save(affectedItems);

  return item;
}

export async function saveItem(
  item: Item,
  itemRepository: Repository<Item>,
): Promise<Item> {
  return itemRepository.save(item);
}

export async function createItemVersion(
  itemVersionLike: DeepPartial<ItemVersion>,
  itemVersionRepository: Repository<ItemVersion>,
) {
  let now = Date.now();

  if (!itemVersionLike.hasOwnProperty('fromId')) {
    itemVersionLike.fromId = 0;
  }

  itemVersionLike.createdAt = now;

  itemVersionLike.commentCount = 0;
  itemVersionLike.thumbUpCount = 0;

  let itemVersion = itemVersionRepository.create(itemVersionLike);

  return itemVersionRepository.save(itemVersion);
}

export async function saveItemVersion(
  itemVersion: ItemVersion,
  itemVersionRepository: Repository<ItemVersion>,
): Promise<ItemVersion> {
  return itemVersionRepository.save(itemVersion);
}
