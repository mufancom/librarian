import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {Item} from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private conventionItemRepository: Repository<Item>,
  ) {}

  async getItems(conventionId: number): Promise<Item[]> {
    return this.conventionItemRepository
      .createQueryBuilder()
      .where('convention_id = :conventionId and status = 1', {conventionId})
      .getMany();
  }
}
