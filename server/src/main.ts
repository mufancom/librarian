import {NestFactory} from '@nestjs/core';
import {AppModule} from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}

// tslint:disable-next-line:no-console
bootstrap().catch(console.error);
