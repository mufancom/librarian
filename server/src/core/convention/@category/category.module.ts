import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {ConventionCategoryController} from './category.controller';
import {Category} from './category.entity';
import {ConventionCategoryService} from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [ConventionCategoryController],
  providers: [ConventionCategoryService],
  exports: [ConventionCategoryService],
})
export class ConventionCategoryModule {}
