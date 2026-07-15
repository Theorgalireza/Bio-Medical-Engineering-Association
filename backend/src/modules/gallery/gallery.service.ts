// gallery.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGalleryDto, UpdateGalleryDto, QueryGalleryDto } from './dto/gallery.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class GalleryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLog: ActivityLogService,
  ) {}

  private async logActivity(params: {
    actorId?: string | null;
    actorEmail?: string | null;
    action: string;
    targetId: string;
    detail: string;
    ip?: string | null;
  }) {
    await this.activityLog.log({
      actorId: params.actorId ?? null,
      actorEmail: params.actorEmail ?? null,
      action: params.action,
      targetType: 'GalleryItem',
      targetId: params.targetId,
      detail: params.detail,
      ip: params.ip ?? null,
    });
  }

  findAll(query: QueryGalleryDto) {
    const where: any = {};
    if (query.category) where.category = query.category;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.galleryItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } } },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.galleryItem.findUnique({
      where: { id },
      include: { uploadedBy: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } } },
    });
    if (!item) throw new NotFoundException('Gallery item not found');
    return item;
  }

  async create(dto: CreateGalleryDto, uploadedById?: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const item = await this.prisma.galleryItem.create({ data: { ...dto, uploadedById } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'CREATE_GALLERY_ITEM',
      targetId: item.id,
      detail: `Created gallery item '${item.title}'`,
      ip,
    });

    return item;
  }

  async update(id: string, dto: UpdateGalleryDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const existing = await this.findOne(id);
    const item = await this.prisma.galleryItem.update({ where: { id }, data: dto });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'UPDATE_GALLERY_ITEM',
      targetId: id,
      detail: `Updated gallery item '${existing.title}'`,
      ip,
    });

    return item;
  }

  async remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const existing = await this.findOne(id);
    await this.prisma.galleryItem.delete({ where: { id } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'DELETE_GALLERY_ITEM',
      targetId: id,
      detail: `Deleted gallery item '${existing.title}'`,
      ip,
    });

    return { message: 'Deleted successfully' };
  }
}
