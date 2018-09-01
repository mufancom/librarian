import {Module} from '@nestjs/common';

import {CoreAuthModule} from '../../core/auth';
import {
  CoreCategoryModule,
  CoreConventionModule,
  CoreItemModule,
} from '../../core/convention';

import {CategoryModule} from './@category';
import {ItemModule} from './@item';
import {ConventionController} from './convention.controller';

@Module({
  imports: [
    CoreConventionModule,
    CoreCategoryModule,
    CoreItemModule,
    CoreAuthModule,
    CategoryModule,
    ItemModule,
  ],
  controllers: [ConventionController],
  providers: [],
  exports: [],
})
export class ConventionModule {}
