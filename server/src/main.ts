import {ExpressSessionMiddleware} from '@nest-middlewares/express-session';
import {NestFactory} from '@nestjs/core';
import {AppModule} from 'app.module';
import {HttpExceptionFilter} from 'modules/filters/http-exception.filter';
import {join} from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  ExpressSessionMiddleware.configure({secret: 's2nKjZqL'});
  app.use(new ExpressSessionMiddleware().resolve());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3001);
}

// tslint:disable-next-line:no-console
bootstrap().catch(console.error);
