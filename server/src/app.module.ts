import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from 'controllers/auth';
import {ConventionModule} from 'controllers/convention';
import {UserModule} from 'controllers/user';
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
