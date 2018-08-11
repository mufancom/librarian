import {Injectable, ServiceUnavailableException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {ItemComment} from './item-comment.entity';

@Injectable()
export class ItemCommentService {
  constructor(
    @InjectRepository(ItemComment)
    private itemCommentRepository: Repository<ItemComment>,
  ) {}

  async create(itemCommentLike: DeepPartial<ItemComment>) {
    let itemComment = this.itemCommentRepository.create(itemCommentLike);

    itemComment.status = 1;

    return this.itemCommentRepository.save(itemComment);
  }

  async save(itemComment: ItemComment) {
    return this.itemCommentRepository.save(itemComment);
  }

  async delete(itemComment: ItemComment) {
    itemComment.status = 0;
  }
}
