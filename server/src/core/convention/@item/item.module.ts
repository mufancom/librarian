import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
  Item,
  ItemComment,
  ItemThumbUp,
  ItemVersion,
} from 'shared/entities/convention/item';

import {AuthModule} from '../../auth';
import {ConventionModule} from '../convention.module';

import {ItemCommentController, ItemCommentService} from './@item-comment';
import {ItemThumbUpController, ItemThumbUpService} from './@item-thumb-up';
import {ItemController} from './item.controller';
import {ItemService} from './item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, ItemVersion, ItemThumbUp, ItemComment]),
    forwardRef(() => ConventionModule),
    AuthModule,
  ],
  controllers: [ItemController, ItemCommentController, ItemThumbUpController],
  providers: [ItemService, ItemCommentService, ItemThumbUpService],
  exports: [ItemService],
})
export class ItemModule {}
