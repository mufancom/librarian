import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {CoreAuthModule} from '../../auth';
import {CoreConventionModule} from '../convention.module';

import {ItemCommentService} from './item-comment';
import {ItemComment} from './item-comment/item-comment.entity';
import {ItemThumbUpService} from './item-thumb-up';
import {ItemThumbUp} from './item-thumb-up/item-thumb-up.entity';
import {ItemVersion} from './item-version.entity';
import {Item} from './item.entity';
import {ItemService} from './item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, ItemVersion, ItemThumbUp, ItemComment]),
    forwardRef(() => CoreConventionModule),
    CoreAuthModule,
  ],
  controllers: [],
  providers: [ItemService, ItemCommentService, ItemThumbUpService],
  exports: [ItemService, ItemCommentService, ItemThumbUpService],
})
export class CoreItemModule {}
