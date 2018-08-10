import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {ConventionItem} from './item.entity';

@Injectable()
export class ConventionItemService {
  constructor(
    @InjectRepository(ConventionItem)
    private conventionItemRepository: Repository<ConventionItem>,
  ) {}

  async getItems(conventionId: number): Promise<ConventionItem[]> {
    return this.conventionItemRepository
      .createQueryBuilder()
      .where('convention_id = :conventionId and status = 1', {conventionId})
      .getMany();
  }
}
