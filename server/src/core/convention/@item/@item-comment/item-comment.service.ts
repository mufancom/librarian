import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {ItemComment, ItemCommentStatus} from './item-comment.entity';

@Injectable()
export class ItemCommentService {
  constructor(
    @InjectRepository(ItemComment)
    private itemCommentRepository: Repository<ItemComment>,
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

    return this.itemCommentRepository.save(itemComment);
  }
}
