// gallery.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGalleryDto, UpdateGalleryDto, QueryGalleryDto } from './dto/gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

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

  create(dto: CreateGalleryDto, uploadedById?: string) {
    return this.prisma.galleryItem.create({ data: { ...dto, uploadedById } });
  }

  async update(id: string, dto: UpdateGalleryDto) {
    await this.findOne(id);
    return this.prisma.galleryItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.galleryItem.delete({ where: { id } });
    return { message: 'Deleted successfully' };
  }
}
