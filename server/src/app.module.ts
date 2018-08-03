import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from 'modules/auth/auth.module';
import {ConventionModule} from 'modules/convention/convention.module';
import {UserModule} from 'modules/user/user.module';
import {Config} from 'utils/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: ['./src/**/**.entity{.ts,.js}'],
      ...Config.Database.get(),
      entityPrefix: Config.Database.get('prefix')
        ? Config.Database.get('prefix')
        : 'lb_',
    }),
    UserModule,
    AuthModule,
    ConventionModule,
  ],
  controllers: [],
})
export class AppModule {}
