import {Module} from '@nestjs/common';

import {CoreAuthModule} from '../../core/auth';
import {CoreUserModule} from '../../core/user';

import {UserController} from './user.controller';

@Module({
  imports: [CoreAuthModule, CoreUserModule],
  controllers: [UserController],
  providers: [],
  exports: [],
})
export class UserModule {}
