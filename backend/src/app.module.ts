import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { ContactModule } from './modules/contact/contact.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { CsrfGuard } from './common/guards/csrf.guard';
import appConfig from './config/config';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';

function toSafePositiveInt(value: unknown, fallback: number) {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const ttl = toSafePositiveInt(config.get('THROTTLE_TTL'), 60000);
        const limit = toSafePositiveInt(config.get('THROTTLE_LIMIT'), 100);

        return {
          throttlers: [
            {
              name: 'default',
              ttl,
              limit,
            },
          ],
          skipIf: () =>
            process.env.NODE_ENV === 'test' ||
            process.env.JEST_WORKER_ID !== undefined ||
            ttl <= 0 ||
            limit <= 0,
        };
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
        level: process.env.LOG_LEVEL || 'info',
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AnnouncementsModule,
    ArticlesModule,
    PublicationsModule,
    FacultyModule,
    GalleryModule,
    FeedbackModule,
    ContactModule,
    ActivityLogModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: CsrfGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
