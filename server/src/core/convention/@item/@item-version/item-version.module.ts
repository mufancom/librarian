import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {ItemVersion} from './item-version.entity';
import {ItemVersionService} from './item-version.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemVersion])],
  controllers: [],
  providers: [ItemVersionService],
  exports: [ItemVersionService],
})
export class ItemVersionModule {}
