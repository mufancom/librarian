import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {ItemVersionModule} from './@item-version';
import {ItemController} from './item.controller';
import {Item} from './item.entity';
import {ItemService} from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), ItemVersionModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
