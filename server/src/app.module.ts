import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
