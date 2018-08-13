import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from 'core/auth';
import {ConventionModule} from 'core/convention';
import {UserModule} from 'core/user';
import {Config} from 'utils/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: ['./src/**/**.entity{.ts,.js}'],
      ...Config.database.get(),
    }),
    UserModule,
    AuthModule,
    ConventionModule,
  ],
  controllers: [],
})
export class AppModule {}
