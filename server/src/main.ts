import {ExpressSessionMiddleware} from '@nest-middlewares/express-session';
import {NestFactory} from '@nestjs/core';

import {AppModule} from 'app.module';
import {HttpExceptionFilter} from 'common/filters/http-exception.filter';
import {APIInterceptor} from 'common/interceptors/api.interceptor';
import {PUBLIC_DIR} from 'paths';
import {Config} from 'utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  ExpressSessionMiddleware.configure(Config.Session.get() as {secret: string});
  app.use(new ExpressSessionMiddleware().resolve());
  app.useStaticAssets(PUBLIC_DIR);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new APIInterceptor());

  await app.listen(process.env.PORT || 3002);
}

bootstrap().catch(console.error);
