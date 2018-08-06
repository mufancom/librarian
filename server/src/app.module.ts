import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from 'core/auth';
import {CommentModule} from 'core/comment';
import {ConventionModule} from 'core/convention';
import {UserModule} from 'core/user';
import {Config} from 'utils/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: ['./src/**/**.entity{.ts,.js}'],
      ...Config.Database.get(),
      entityPrefix: Config.Database.get('entityPrefix', 'lb_'),
    }),
    UserModule,
    AuthModule,
    ConventionModule,
    CommentModule,
  ],
  controllers: [],
})
export class AppModule {}
