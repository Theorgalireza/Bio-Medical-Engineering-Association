// faculty.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFacultyDto, UpdateFacultyDto, QueryFacultyDto } from './dto/faculty.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class FacultyService {
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
      targetType: 'Faculty',
      targetId: params.targetId,
      detail: params.detail,
      ip: params.ip ?? null,
    });
  }

  findAll(query: QueryFacultyDto) {
    const where: any = {};
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { monogram: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.facultyMember.findMany({ where, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.facultyMember.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Faculty member not found');
    return item;
  }

  async create(dto: CreateFacultyDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const item = await this.prisma.facultyMember.create({ data: { ...dto, specialties: dto.specialties } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'CREATE_FACULTY',
      targetId: item.id,
      detail: `Created faculty member ${item.name}`,
      ip,
    });

    return item;
  }

  async update(id: string, dto: UpdateFacultyDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const existing = await this.findOne(id);
    const item = await this.prisma.facultyMember.update({ where: { id }, data: dto });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'UPDATE_FACULTY',
      targetId: id,
      detail: `Updated faculty member ${existing.name}`,
      ip,
    });

    return item;
  }

  async remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const existing = await this.findOne(id);
    await this.prisma.facultyMember.delete({ where: { id } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'DELETE_FACULTY',
      targetId: id,
      detail: `Deleted faculty member ${existing.name}`,
      ip,
    });

    return { message: 'Deleted successfully' };
  }
}
