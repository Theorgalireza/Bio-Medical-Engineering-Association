// feedback.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const item = await this.prisma.feedback.create({ data: dto });

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
    await this.prisma.feedback.delete({ where: { id } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'DELETE_FEEDBACK',
      targetId: id,
      detail: `Deleted feedback from ${existing.name}`,
      ip,
    });

    return { message: 'Deleted successfully' };
  }
}
