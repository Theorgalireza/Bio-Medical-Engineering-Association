// feedback.module.ts
import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({ imports: [PrismaModule, ActivityLogModule], controllers: [FeedbackController], providers: [FeedbackService] })
export class FeedbackModule {}
