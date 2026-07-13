// publications.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePublicationDto, UpdatePublicationDto, QueryPublicationDto } from './dto/publication.dto';

@Injectable()
export class PublicationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: QueryPublicationDto) {
    const where: any = {};
    if (query.category) where.category = query.category;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { summary: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.publication.findMany({ where, orderBy: { year: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.publication.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Publication not found');
    return item;
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.publication.findUnique({ where: { slug } });
    if (!item) throw new NotFoundException('Publication not found');
    return item;
  }

  async create(dto: CreatePublicationDto) {
    const existing = await this.prisma.publication.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug already exists');
    return this.prisma.publication.create({
      data: { ...dto, publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined },
    });
  }

  async update(id: string, dto: UpdatePublicationDto) {
    await this.findOne(id);
    return this.prisma.publication.update({
      where: { id },
      data: { ...dto, publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.publication.delete({ where: { id } });
    return { message: 'Deleted successfully' };
  }
}
