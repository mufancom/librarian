import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {ConventionModule} from '../convention.module';

import {ItemCommentModule} from './@item-comment';
import {ItemVersion} from './item-version.entity';
import {ItemController} from './item.controller';
import {Item} from './item.entity';
import {ItemService} from './item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, ItemVersion]),
    forwardRef(() => ConventionModule),
    ItemCommentModule,
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
