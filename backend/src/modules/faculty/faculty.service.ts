// faculty.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFacultyDto, UpdateFacultyDto, QueryFacultyDto } from './dto/faculty.dto';

@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

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

  create(dto: CreateFacultyDto) {
    return this.prisma.facultyMember.create({ data: { ...dto, specialties: dto.specialties } });
  }

  async update(id: string, dto: UpdateFacultyDto) {
    await this.findOne(id);
    return this.prisma.facultyMember.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.facultyMember.delete({ where: { id } });
    return { message: 'Deleted successfully' };
  }
}
