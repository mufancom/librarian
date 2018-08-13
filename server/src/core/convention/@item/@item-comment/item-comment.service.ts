import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ItemComment, ItemCommentStatus} from 'shared/entities/convention/item';
import {User} from 'shared/entities/user';
import {DeepPartial, Repository} from 'typeorm';

import {splitJoinedResult} from 'utils/repository';

import {ItemService} from '../item.service';

const COMMENT_PAGE_SIZE = 10;

export interface CommentWithUserInfo {
  comment: ItemComment;
  user: {
    id: number;
    username: string;
  };
}

@Injectable()
export class ItemCommentService {
  constructor(
    @InjectRepository(ItemComment)
    private itemCommentRepository: Repository<ItemComment>,
    private itemService: ItemService,
  ) {}

  async getOneById(id: number): Promise<ItemComment | undefined> {
    return this.itemCommentRepository
      .createQueryBuilder()
      .where('id = :id and status != :deleted', {
        id,
        deleted: ItemCommentStatus.deleted,
      })
      .getOne();
  }

  async getManyByItemVersionId(
    versionId: number,
    page: number,
  ): Promise<ItemComment[]> {
    return this.itemCommentRepository
      .createQueryBuilder()
      .where('convention_item_version_id = :versionId and status != :deleted', {
        versionId,
        deleted: ItemCommentStatus.deleted,
      })
      .offset(COMMENT_PAGE_SIZE * (page - 1))
      .take(COMMENT_PAGE_SIZE)
      .getMany();
  }

  async getManyWithUserInfoByItemVersionId(
    versionId: number,
    page: number,
  ): Promise<CommentWithUserInfo[]> {
    let mixedJoinedItems = await this.itemCommentRepository
      .createQueryBuilder()
      .where('convention_item_version_id = :versionId and status != :deleted', {
        versionId,
        deleted: ItemCommentStatus.deleted,
      })
      .leftJoinAndMapOne('user', User, 'User', 'User.id = user_id')
      .offset(COMMENT_PAGE_SIZE * (page - 1))
      .limit(COMMENT_PAGE_SIZE)
      .execute();

    let result: CommentWithUserInfo[] = [];

    for (let mixedJoinedItem of mixedJoinedItems) {
      let {left: comment, right: user} = splitJoinedResult<ItemComment, User>(
        'ItemComment',
        'User',
        mixedJoinedItem,
      );

      let {id, username} = user;

      result.push({
        comment,
        user: {id, username},
      });
    }

    return result;
  }

  async create(userId: number, itemCommentLike: DeepPartial<ItemComment>) {
    let now = Date.now();

    let itemComment = this.itemCommentRepository.create({
      ...itemCommentLike,
      userId,
    });

    if (!itemComment.hasOwnProperty('parentId')) {
      itemComment.parentId = 0;
    }

    itemComment.status = ItemCommentStatus.normal;
    itemComment.createdAt = now;
    itemComment.updatedAt = now;

    await this.itemService.increaseItemVersionCommentCount(
      itemComment.itemVersionId,
    );

    return this.itemCommentRepository.save(itemComment);
  }

  async save(itemComment: ItemComment): Promise<ItemComment> {
    let now = Date.now();

    itemComment.updatedAt = now;

    return this.itemCommentRepository.save(itemComment);
  }

  async delete(itemComment: ItemComment): Promise<ItemComment> {
    let now = Date.now();

    itemComment.status = ItemCommentStatus.deleted;
    itemComment.deletedAt = now;

    await this.itemService.decreaseItemVersionCommentCount(
      itemComment.itemVersionId,
    );

    return this.itemCommentRepository.save(itemComment);
  }
}
