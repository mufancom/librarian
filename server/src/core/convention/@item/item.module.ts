import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../auth';
import {ConventionModule} from '../convention.module';

import {ItemCommentController, ItemCommentService} from './@item-comment';
import {ItemComment} from './@item-comment/item-comment.entity';
import {ItemThumbUpController, ItemThumbUpService} from './@item-thumb-up';
import {ItemThumbUp} from './@item-thumb-up/item-thumb-up.entity';
import {ItemVersion} from './item-version.entity';
import {ItemController} from './item.controller';
import {Item} from './item.entity';
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
