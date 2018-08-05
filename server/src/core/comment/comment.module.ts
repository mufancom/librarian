import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../auth';
import {CommentController} from './comment.controller';
import {Comment} from './comment.entity';
import {CommentService} from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), AuthModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [],
})
export class CommentModule {}
