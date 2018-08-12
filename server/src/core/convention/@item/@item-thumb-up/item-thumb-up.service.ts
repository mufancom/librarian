import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {UnnecessaryRequestException} from 'common/exceptions';

import {User} from '../../../user';
import {ItemVersion} from '../item-version.entity';
import {ItemService} from '../item.service';

import {ItemThumbUp, ItemThumbUpStatus} from './item-thumb-up.entity';

@Injectable()
export class ItemThumbUpService {
  constructor(
    @InjectRepository(ItemThumbUp)
    private itemThumbUpRepository: Repository<ItemThumbUp>,
    private itemService: ItemService,
  ) {}

  async getByUserAndItemVersionId(
    user: User,
    itemVersionId: number,
  ): Promise<ItemThumbUp | undefined> {
    let {id: userId} = user;

    return this.itemThumbUpRepository
      .createQueryBuilder()
      .where('user_id = :userId and convention_item_version_id = :versionId', {
        userId,
        itemVersionId,
      })
      .getOne();
  }

  async thumbUp(user: User, itemVersionId: number): Promise<ItemThumbUp> {
    let {id: userId} = user;

    let itemThumbUp = await this.getByUserAndItemVersionId(user, itemVersionId);

    if (itemThumbUp) {
      if (itemThumbUp.status === ItemThumbUpStatus.liked) {
        throw new UnnecessaryRequestException('ITEM_VERSION_ALREADY_LIKED');
      }

      itemThumbUp.status = ItemThumbUpStatus.liked;
      await this.itemService.increaseItemVersionThumbUpCount(itemVersionId);

      return this.itemThumbUpRepository.save(itemThumbUp);
    } else {
      return this.create({userId, itemVersionId});
    }
  }

  async cancelThumbUp(user: User, itemVersionId: number): Promise<ItemThumbUp> {
    let itemThumbUp = await this.getByUserAndItemVersionId(user, itemVersionId);
    if (!itemThumbUp) {
      throw new UnnecessaryRequestException('ITEM_VERSION_NOT_LIKED_YET');
    }

    itemThumbUp.status = ItemThumbUpStatus.indifferent;

    return this.save(itemThumbUp);
  }

  async create(
    itemThumbUpLike: DeepPartial<ItemThumbUp>,
  ): Promise<ItemThumbUp> {
    let now = Date.now();

    let itemThumbUp = await this.itemThumbUpRepository.create(itemThumbUpLike);

    itemThumbUp.status = ItemThumbUpStatus.liked;
    itemThumbUp.updatedAt = now;

    return this.itemThumbUpRepository.save(itemThumbUp);
  }

  async save(itemThumbUp: ItemThumbUp): Promise<ItemThumbUp> {
    let now = Date.now();

    itemThumbUp.updatedAt = now;

    return this.itemThumbUpRepository.save(itemThumbUp);
  }
}
