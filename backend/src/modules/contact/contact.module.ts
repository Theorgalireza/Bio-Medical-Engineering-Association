// contact.module.ts
import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({ imports: [PrismaModule, ActivityLogModule], controllers: [ContactController], providers: [ContactService] })
export class ContactModule {}
