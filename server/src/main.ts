import * as Path from 'path';

import {ExpressSessionMiddleware} from '@nest-middlewares/express-session';
import {NestFactory} from '@nestjs/core';

import {AppModule} from 'app.module';
import {HttpExceptionFilter} from 'common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  ExpressSessionMiddleware.configure({secret: 's2nKjZqL'});
  app.use(new ExpressSessionMiddleware().resolve());
  app.useStaticAssets(Path.join(__dirname, '../public'));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3001);
}

bootstrap().catch(console.error);
