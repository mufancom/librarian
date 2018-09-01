import {Module} from '@nestjs/common';

import {CoreAuthModule} from '../../core/auth';
import {CoreUserModule} from '../../core/user';

import {AuthController} from './auth.controller';

@Module({
  imports: [CoreUserModule, CoreAuthModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
