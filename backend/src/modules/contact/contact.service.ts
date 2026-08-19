// contact.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
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
    const referenceCode = `CNT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomBytes(3).toString('hex').toUpperCase()}`;
    const item = await this.prisma.contact.create({ data: { ...dto, referenceCode } });

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
    await this.prisma.deletedRecord.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    const trash = await this.prisma.deletedRecord.create({
      data: {
        entityType: 'Contact',
        entityId: id,
        payload: JSON.parse(JSON.stringify(existing)),
        deletedBy: actorId ?? null,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    await this.prisma.contact.delete({ where: { id } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'DELETE_CONTACT_MESSAGE',
      targetId: id,
      detail: `Deleted contact message from ${existing.email}`,
      ip,
    });

    return { message: 'Deleted successfully', undoToken: trash.token, undoExpiresAt: trash.expiresAt };
  }

  async restore(token: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const trash = await this.prisma.deletedRecord.findUnique({ where: { token } });
    if (!trash || trash.entityType !== 'Contact' || trash.expiresAt < new Date()) {
      throw new NotFoundException('Undo window expired');
    }
    const payload = trash.payload as any;
    const restored = await this.prisma.$transaction(async (tx) => {
      const item = await tx.contact.create({ data: payload });
      await tx.deletedRecord.delete({ where: { id: trash.id } });
      return item;
    });
    await this.logActivity({
      actorId,
      actorEmail,
      action: 'RESTORE_CONTACT_MESSAGE',
      targetId: restored.id,
      detail: `Restored contact message ${restored.referenceCode}`,
      ip,
    });
    return restored;
  }
}
