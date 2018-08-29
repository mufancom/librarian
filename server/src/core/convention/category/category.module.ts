import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {CoreAuthModule} from '../../auth';
import {CoreConventionModule} from '../convention.module';

import {Category} from './category.entity';
import {CategoryService} from './category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    CoreAuthModule,
    forwardRef(() => CoreConventionModule),
  ],
  controllers: [],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CoreCategoryModule {}
