import {ExpressSessionMiddleware} from '@nest-middlewares/express-session';
import {NestFactory} from '@nestjs/core';

import {AppModule} from 'app.module';
import {HttpExceptionFilter} from 'common/filters/http-exception.filter';
import {APIInterceptor} from 'common/interceptors/api.interceptor';
import {ValidationPipe} from 'common/pipes/validation.pipe';
import {PUBLIC_DIR} from 'paths';
import {Config} from 'utils/config';

const DEFAULT_PORT = 3002;

declare global {
  namespace Express {
    interface SessionData {
      user?: {id: number};
    }
  }
}

ExpressSessionMiddleware.configure(Config.session.get());

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin: 'http://localhost:3000', credentials: true});

  app.use(new ExpressSessionMiddleware().resolve());

  app.useStaticAssets(PUBLIC_DIR);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new APIInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || DEFAULT_PORT);
}

bootstrap().catch(console.error);
