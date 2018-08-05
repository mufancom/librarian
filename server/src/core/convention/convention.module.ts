import {Module} from '@nestjs/common';

import {AuthModule} from '../auth';
import {ConventionController} from './convention.controller';
import {ConventionService} from './convention.service';

@Module({
  imports: [AuthModule],
  controllers: [ConventionController],
  providers: [ConventionService],
  exports: [],
})
export class ConventionModule {}
