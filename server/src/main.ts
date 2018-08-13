import {ExpressSessionMiddleware} from '@nest-middlewares/express-session';
import {NestFactory} from '@nestjs/core';

import {AppModule} from 'app.module';
import {HttpExceptionFilter} from 'common/filters/http-exception.filter';
import {APIInterceptor} from 'common/interceptors/api.interceptor';
import {ValidationPipe} from 'common/pipes/validation.pipe';
import {Config} from 'utils/config';

const DEFAULT_PORT = 3002;

ExpressSessionMiddleware.configure(Config.session.get());

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin: Config.server.get('corsOrigin'), credentials: true});

  app.use(new ExpressSessionMiddleware().resolve());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new APIInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || Config.server.get('port', DEFAULT_PORT));
}

bootstrap().catch(console.error);
