import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../auth';
import {ConventionModule} from '../convention.module';

import {ItemCommentModule, ItemComment} from './@item-comment';
import {ItemVersion} from './item-version.entity';
import {ItemController} from './item.controller';
import {Item} from './item.entity';
import {ItemService} from './item.service';
import {ItemThumbUp} from './@item-thumb-up';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, ItemVersion, ItemThumbUp, ItemComment]),
    forwardRef(() => ConventionModule),
    ItemCommentModule,
    AuthModule,
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
