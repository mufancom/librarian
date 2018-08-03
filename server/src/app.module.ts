import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthGuard} from './modules/auth/auth.guard';

import {AuthModule} from 'modules/auth/auth.module';
import {UserModule} from 'modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/data.sqlite',
      entities: ['./src/**/**.entity{.ts,.js}'],
      entityPrefix: 'lb_',
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
