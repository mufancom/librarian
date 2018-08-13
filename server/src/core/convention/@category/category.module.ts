import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../auth';

import {CategoryController} from './category.controller';
import {Category} from './category.entity';
import {CategoryService} from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
