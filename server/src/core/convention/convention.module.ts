import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../auth';

import {ConventionCategoryModule} from './@category';
import {ConventionItemModule} from './@item';
import {ConventionController} from './convention.controller';
import {Convention} from './convention.entity';
import {ConventionService} from './convention.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Convention]),
    ConventionCategoryModule,
    ConventionItemModule,
    AuthModule,
  ],
  controllers: [ConventionController],
  providers: [ConventionService],
  exports: [ConventionService],
})
export class ConventionModule {}
