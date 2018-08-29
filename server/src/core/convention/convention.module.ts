import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {CoreAuthModule} from '../auth';

import {CoreCategoryModule} from './category';
import {Convention} from './convention.entity';
import {ConventionService} from './convention.service';
import {CoreItemModule} from './item';

@Module({
  imports: [
    TypeOrmModule.forFeature([Convention]),
    CoreCategoryModule,
    CoreItemModule,
    CoreAuthModule,
  ],
  controllers: [],
  providers: [ConventionService],
  exports: [ConventionService],
})
export class CoreConventionModule {}
