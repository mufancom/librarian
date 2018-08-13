import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Convention} from 'shared/entities/convention';

import {AuthModule} from '../auth';

import {CategoryModule} from './@category';
import {ItemModule} from './@item';
import {ConventionController} from './convention.controller';
import {ConventionService} from './convention.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Convention]),
    CategoryModule,
    ItemModule,
    AuthModule,
  ],
  controllers: [ConventionController],
  providers: [ConventionService],
  exports: [ConventionService],
})
export class ConventionModule {}
