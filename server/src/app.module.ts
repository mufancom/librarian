import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from 'core/auth/auth.module';
import {UserModule} from 'core/user/user.module';

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
