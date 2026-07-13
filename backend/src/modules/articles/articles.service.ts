// articles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, User } from '@prisma/client';
import { CreateArticleDto, UpdateArticleDto, QueryArticleDto } from './dto/article.dto';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: QueryArticleDto) {
    const where: any = { status: ContentStatus.PUBLISHED };
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;
    if (query.featured !== undefined) where.featured = query.featured;
    if (query.tag) where.tags = { some: { tag: { name: query.tag } } };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { summary: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { tags: { include: { tag: true } } },
    });
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.article.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    });
    if (!item) throw new NotFoundException('Article not found');
    return item;
  }

  async create(dto: CreateArticleDto, user: User) {
    const { tags, ...data } = dto;
    const base = slugify(dto.title, { lower: true, strict: true });
    const exists = await this.prisma.article.findUnique({ where: { slug: base } });
    const slug = exists ? `${base}-${Date.now()}` : base;
    const status = dto.status ?? ContentStatus.DRAFT;

    return this.prisma.article.create({
      data: {
        ...data,
        slug,
        authorId: user.id,
        status,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
        tags: tags?.length ? { create: await this.resolveTagConnects(tags) } : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Article not found');

    const { tags, ...data } = dto;
    let slug = existing.slug;
    if (dto.title && dto.title !== existing.title) {
      const base = slugify(dto.title, { lower: true, strict: true });
      const conflict = await this.prisma.article.findUnique({ where: { slug: base } });
      slug = conflict ? `${base}-${Date.now()}` : base;
    }

    const status = dto.status ?? existing.status;

    if (tags) {
      await this.prisma.articleTag.deleteMany({ where: { articleId: id } });
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        ...data,
        slug,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : existing.publishedAt,
        tags: tags?.length ? { create: await this.resolveTagConnects(tags) } : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  async remove(id: string) {
    const item = await this.prisma.article.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Article not found');
    await this.prisma.article.delete({ where: { id } });
    return { message: 'Deleted successfully' };
  }

  private async resolveTagConnects(tagNames: string[]) {
    return Promise.all(
      tagNames.map(async (name) => {
        const tag = await this.prisma.tag.upsert({
          where: { name },
          create: { name },
          update: {},
        });
        return { tagId: tag.id };
      }),
    );
  }
}
