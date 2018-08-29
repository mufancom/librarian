import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {User} from './user.entity';
import {UserDataService} from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class CoreUserModule {}
