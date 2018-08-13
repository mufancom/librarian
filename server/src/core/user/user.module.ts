import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../auth';

import {UserController} from './user.controller';
import {User} from './user.entity';
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
