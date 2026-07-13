// feedback.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

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

  create(dto: CreateFeedbackDto) {
    return this.prisma.feedback.create({ data: dto });
  }

  async update(id: string, dto: UpdateFeedbackDto) {
    await this.findOne(id);
    return this.prisma.feedback.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.feedback.delete({ where: { id } });
    return { message: 'Deleted successfully' };
  }
}
