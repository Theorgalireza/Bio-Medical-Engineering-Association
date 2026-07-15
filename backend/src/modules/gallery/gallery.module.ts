// gallery.module.ts
import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({ imports: [PrismaModule, ActivityLogModule], controllers: [GalleryController], providers: [GalleryService] })
export class GalleryModule {}
