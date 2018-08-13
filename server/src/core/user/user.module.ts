import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'shared/entities/user';

import {AuthModule} from '../auth';

import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // to solve circular dependency
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
