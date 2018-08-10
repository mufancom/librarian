import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {ConventionModule} from '../convention.module';

import {ItemVersionModule} from './@item-version';
import {ItemController} from './item.controller';
import {Item} from './item.entity';
import {ItemService} from './item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    ItemVersionModule,
    forwardRef(() => ConventionModule),
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
