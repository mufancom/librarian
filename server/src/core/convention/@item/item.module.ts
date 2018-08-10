import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {ConventionItemController} from './item.controller';
import {ConventionItem} from './item.entity';
import {ConventionItemService} from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConventionItem])],
  controllers: [ConventionItemController],
  providers: [ConventionItemService],
  exports: [ConventionItemService],
})
export class ConventionItemModule {}
