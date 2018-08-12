import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../../auth';
import {ItemModule} from '../item.module';

import {ItemThumbUpController} from './item-thumb-up.controller';
import {ItemThumbUp} from './item-thumb-up.entity';
import {ItemThumbUpService} from './item-thumb-up.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemThumbUp]),
    forwardRef(() => ItemModule),
    AuthModule,
  ],
  controllers: [ItemThumbUpController],
  providers: [ItemThumbUpService],
  exports: [],
})
export class ItemThumbUpModule {}
