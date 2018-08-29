import {Module} from '@nestjs/common';

import {CoreUserModule} from '../user';

import {AuthService} from './auth.service';

@Module({
  imports: [CoreUserModule],
  controllers: [],
  providers: [AuthService],
  exports: [AuthService],
})
export class CoreAuthModule {}
