// announcements.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, User } from '@prisma/client';
import { CreateAnnouncementDto, UpdateAnnouncementDto, QueryAnnouncementDto } from './dto/announcement.dto';
import slugify from 'slugify';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(dto: CreateAnnouncementDto, user: User) {
    const base = slugify(dto.title, { lower: true, strict: true });
    const exists = await this.prisma.announcement.findUnique({ where: { slug: base } });
    const slug = exists ? `${base}-${Date.now()}` : base;
    const status = dto.status ?? ContentStatus.DRAFT;
    return this.prisma.announcement.create({
      data: { ...dto, slug, authorId: user.id, status, publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null },
    });
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    const existing = await this.prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Announcement not found');

    let slug = existing.slug;
    if (dto.title && dto.title !== existing.title) {
      const base = slugify(dto.title, { lower: true, strict: true });
      const conflict = await this.prisma.announcement.findUnique({ where: { slug: base } });
      slug = conflict ? `${base}-${Date.now()}` : base;
    }

    const status = dto.status ?? existing.status;
    return this.prisma.announcement.update({
      where: { id },
      data: { ...dto, slug, publishedAt: status === ContentStatus.PUBLISHED ? new Date() : existing.publishedAt },
    });
  }

  async remove(id: string) {
    const item = await this.prisma.announcement.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Announcement not found');
    await this.prisma.announcement.delete({ where: { id } });
    return { message: 'Deleted successfully' };
  }
}
