import {Module} from '@nestjs/common';

import {ItemVersionController} from './item-version.controller';
import {ItemVersionService} from './item-version.service';

@Module({
  imports: [],
  controllers: [ItemVersionController],
  providers: [ItemVersionService],
  exports: [],
})
export class ItemVersionModule {}
