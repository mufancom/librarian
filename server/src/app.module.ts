import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from 'core/auth/auth.module';
import {UserModule} from 'core/user/user.module';

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
