import {Module} from '@nestjs/common';

import {CoreAuthModule} from 'core/auth';
import {CoreCategoryModule} from 'core/convention';

import {CategoryController} from './category.controller';

@Module({
  imports: [CoreAuthModule, CoreCategoryModule],
  controllers: [CategoryController],
  providers: [],
  exports: [],
})
export class CategoryModule {}
