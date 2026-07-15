// contact.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto, QueryContactDto } from './dto/contact.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class ContactService {
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
      targetType: 'ContactMessage',
      targetId: params.targetId,
      detail: params.detail,
      ip: params.ip ?? null,
    });
  }

  findAll(query: QueryContactDto) {
    const where: any = {};
    if (query.read !== undefined) where.read = query.read;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.contact.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.contact.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Contact message not found');
    return item;
  }

  async create(dto: CreateContactDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const item = await this.prisma.contact.create({ data: dto });

    await this.logActivity({
      actorId,
      actorEmail: actorEmail ?? dto.email,
      action: 'RECEIVE_CONTACT_MESSAGE',
      targetId: item.id,
      detail: `New contact message from ${dto.email} (${dto.name})`,
      ip,
    });

    return item;
  }

  async update(id: string, dto: UpdateContactDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const existing = await this.findOne(id);
    const item = await this.prisma.contact.update({ where: { id }, data: dto });

    if (dto.read !== undefined && dto.read !== existing.read) {
      await this.logActivity({
        actorId,
        actorEmail,
        action: 'MARK_CONTACT_READ',
        targetId: id,
        detail: `Marked contact message from ${existing.email} as ${dto.read ? 'read' : 'unread'}`,
        ip,
      });
    }

    return item;
  }

  async remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const existing = await this.findOne(id);
    await this.prisma.contact.delete({ where: { id } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'DELETE_CONTACT_MESSAGE',
      targetId: id,
      detail: `Deleted contact message from ${existing.email}`,
      ip,
    });

    return { message: 'Deleted successfully' };
  }
}
