// feedback.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class FeedbackService {
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
      targetType: 'Feedback',
      targetId: params.targetId,
      detail: params.detail,
      ip: params.ip ?? null,
    });
  }

  findAll(query: QueryFeedbackDto) {
    const where: any = {};
    if (query.approved !== undefined) where.approved = query.approved;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.feedback.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.feedback.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Feedback not found');
    return item;
  }

  async create(dto: CreateFeedbackDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const referenceCode = `FDB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomBytes(3).toString('hex').toUpperCase()}`;
    const item = await this.prisma.feedback.create({ data: { ...dto, referenceCode } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'RECEIVE_FEEDBACK',
      targetId: item.id,
      detail: `Received feedback from ${item.name}`,
      ip,
    });

    return item;
  }

  async update(id: string, dto: UpdateFeedbackDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const existing = await this.findOne(id);
    const item = await this.prisma.feedback.update({ where: { id }, data: dto });

    if (dto.approved !== undefined && dto.approved !== existing.approved) {
      await this.logActivity({
        actorId,
        actorEmail,
        action: 'UPDATE_FEEDBACK',
        targetId: id,
        detail: `Updated feedback approval status for ${existing.name} to ${dto.approved ? 'approved' : 'unapproved'}`,
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
        entityType: 'Feedback',
        entityId: id,
        payload: JSON.parse(JSON.stringify(existing)),
        deletedBy: actorId ?? null,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    await this.prisma.feedback.delete({ where: { id } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'DELETE_FEEDBACK',
      targetId: id,
      detail: `Deleted feedback from ${existing.name}`,
      ip,
    });

    return { message: 'Deleted successfully', undoToken: trash.token, undoExpiresAt: trash.expiresAt };
  }

  async restore(token: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const trash = await this.prisma.deletedRecord.findUnique({ where: { token } });
    if (!trash || trash.entityType !== 'Feedback' || trash.expiresAt < new Date()) {
      throw new NotFoundException('Undo window expired');
    }
    const payload = trash.payload as any;
    const restored = await this.prisma.$transaction(async (tx) => {
      const item = await tx.feedback.create({ data: payload });
      await tx.deletedRecord.delete({ where: { id: trash.id } });
      return item;
    });
    await this.logActivity({
      actorId,
      actorEmail,
      action: 'RESTORE_FEEDBACK',
      targetId: restored.id,
      detail: `Restored feedback ${restored.referenceCode}`,
      ip,
    });
    return restored;
  }
}
