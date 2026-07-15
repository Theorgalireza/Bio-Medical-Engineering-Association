// announcements.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, User } from '@prisma/client';
import { CreateAnnouncementDto, UpdateAnnouncementDto, QueryAnnouncementDto } from './dto/announcement.dto';
import slugify from 'slugify';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { sanitizeRichText } from '../../common/utils/sanitize-html.util';

@Injectable()
export class AnnouncementsService {
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
      targetType: 'Announcement',
      targetId: params.targetId,
      detail: params.detail,
      ip: params.ip ?? null,
    });
  }

  findAll(query: QueryAnnouncementDto) {
    const where: any = { status: ContentStatus.PUBLISHED };
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } } },
    });
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.announcement.findUnique({ where: { slug } });
    if (!item) throw new NotFoundException('Announcement not found');
    return item;
  }

  async create(dto: CreateAnnouncementDto, user: User, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const base = slugify(dto.title, { lower: true, strict: true });
    const exists = await this.prisma.announcement.findUnique({ where: { slug: base } });
    const slug = exists ? `${base}-${Date.now()}` : base;
    const status = dto.status ?? ContentStatus.DRAFT;
    const sanitizedData = {
      ...dto,
      description: sanitizeRichText(dto.description),
    };
    const announcement = await this.prisma.announcement.create({
      data: { ...sanitizedData, slug, authorId: user.id, status, publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null },
    });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'CREATE_ANNOUNCEMENT',
      targetId: announcement.id,
      detail: `Created announcement '${announcement.title}' (${announcement.slug})`,
      ip,
    });

    return announcement;
  }

  async update(id: string, dto: UpdateAnnouncementDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const existing = await this.prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Announcement not found');

    let slug = existing.slug;
    if (dto.title && dto.title !== existing.title) {
      const base = slugify(dto.title, { lower: true, strict: true });
      const conflict = await this.prisma.announcement.findUnique({ where: { slug: base } });
      slug = conflict ? `${base}-${Date.now()}` : base;
    }

    const status = dto.status ?? existing.status;
    const sanitizedData = {
      ...dto,
      description: dto.description !== undefined ? sanitizeRichText(dto.description) : undefined,
    };
    const announcement = await this.prisma.announcement.update({
      where: { id },
      data: { ...sanitizedData, slug, publishedAt: status === ContentStatus.PUBLISHED ? new Date() : existing.publishedAt },
    });

    const statusChanged = dto.status !== undefined && dto.status !== existing.status;
    const action = statusChanged
      ? status === ContentStatus.PUBLISHED
        ? 'PUBLISH_ANNOUNCEMENT'
        : 'UNPUBLISH_ANNOUNCEMENT'
      : 'UPDATE_ANNOUNCEMENT';

    await this.logActivity({
      actorId,
      actorEmail,
      action,
      targetId: announcement.id,
      detail: `${action === 'UPDATE_ANNOUNCEMENT' ? 'Updated' : action === 'PUBLISH_ANNOUNCEMENT' ? 'Published' : 'Unpublished'} announcement '${announcement.title}' (${announcement.slug})`,
      ip,
    });

    return announcement;
  }

  async remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const item = await this.prisma.announcement.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Announcement not found');
    await this.prisma.announcement.delete({ where: { id } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'DELETE_ANNOUNCEMENT',
      targetId: id,
      detail: `Deleted announcement '${item.title}' (${item.slug})`,
      ip,
    });

    return { message: 'Deleted successfully' };
  }
}
