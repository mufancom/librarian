import {Module} from '@nestjs/common';

import {CoreAuthModule} from 'core/auth';
import {CoreConventionModule, CoreItemModule} from 'core/convention';
import {CoreNotificationModule} from 'core/notification';

import {ItemCommentController} from './@item-comment';
import {ItemThumbUpController} from './@item-thumb-up';
import {ItemController} from './item.controller';

@Module({
  imports: [
    CoreConventionModule,
    CoreAuthModule,
    CoreItemModule,
    CoreNotificationModule,
  ],
  controllers: [ItemController, ItemCommentController, ItemThumbUpController],
  providers: [],
  exports: [],
})
export class ItemModule {}
