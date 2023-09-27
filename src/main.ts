import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoreResponseInterceptor } from './core/core-response/core-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new CoreResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
