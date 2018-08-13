import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../../auth';
import {ItemModule} from '../item.module';

import {ItemCommentController} from './item-comment.controller';
import {ItemComment} from './item-comment.entity';
import {ItemCommentService} from './item-comment.service';

@Module({
  imports: [forwardRef(() => ItemModule), AuthModule],
  controllers: [ItemCommentController],
  providers: [ItemCommentService],
  exports: [],
})
export class ItemCommentModule {}
