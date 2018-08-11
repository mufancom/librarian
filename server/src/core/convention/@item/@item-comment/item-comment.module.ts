import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {ItemCommentController} from './item-comment.controller';
import {ItemComment} from './item-comment.entity';
import {ItemCommentService} from './item-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemComment])],
  controllers: [ItemCommentController],
  providers: [ItemCommentService],
  exports: [],
})
export class ItemCommentModule {}
