import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyCsrf from '@fastify/csrf-protection';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api/v1');

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  });

  // ثبت پلاگین کوکی روی نمونه Fastify زیرین
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET, // اختیاری؛ برای امضای کوکی
  });

  await app.register(fastifyCsrf, {
    cookieOpts: { signed: true },
  });

  // credentials: true الزامی است تا مرورگر اجازه ارسال/دریافت
  // httpOnly cookie را در درخواست‌های cross-origin بدهد
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Biomedical Association API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));
  }

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
