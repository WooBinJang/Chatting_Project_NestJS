import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public')); //public 폴더 설정
  app.setBaseViewsDir(join(__dirname, '..', 'views')); //view 폴더 설정
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT);
}
bootstrap();
