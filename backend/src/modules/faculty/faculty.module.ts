// faculty.module.ts
import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({ imports: [PrismaModule, ActivityLogModule], controllers: [FacultyController], providers: [FacultyService] })
export class FacultyModule {}
