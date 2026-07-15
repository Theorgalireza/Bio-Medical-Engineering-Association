// articles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus, User } from '@prisma/client';
import { CreateArticleDto, UpdateArticleDto, QueryArticleDto } from './dto/article.dto';
import slugify from 'slugify';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { sanitizeRichText } from '../../common/utils/sanitize-html.util';

@Injectable()
export class ArticlesService {
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
      targetType: 'Article',
      targetId: params.targetId,
      detail: params.detail,
      ip: params.ip ?? null,
    });
  }

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

  async create(dto: CreateArticleDto, user: User, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const { tags, ...data } = dto;
    const base = slugify(dto.title, { lower: true, strict: true });
    const exists = await this.prisma.article.findUnique({ where: { slug: base } });
    const slug = exists ? `${base}-${Date.now()}` : base;
    const status = dto.status ?? ContentStatus.DRAFT;
    const sanitizedData = {
      ...data,
      content: sanitizeRichText(data.content),
    };

    const article = await this.prisma.article.create({
      data: {
        ...sanitizedData,
        slug,
        authorId: user.id,
        status,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
        tags: tags?.length ? { create: await this.resolveTagConnects(tags) } : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'CREATE_ARTICLE',
      targetId: article.id,
      detail: `Created article '${article.title}' (${article.slug})`,
      ip,
    });

    return article;
  }

  async update(id: string, dto: UpdateArticleDto, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
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

    const sanitizedData = {
      ...data,
      content: data.content !== undefined ? sanitizeRichText(data.content) : undefined,
    };

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        ...sanitizedData,
        slug,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : existing.publishedAt,
        tags: tags?.length ? { create: await this.resolveTagConnects(tags) } : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });

    const statusChanged = dto.status !== undefined && dto.status !== existing.status;
    const action = statusChanged
      ? status === ContentStatus.PUBLISHED
        ? 'PUBLISH_ARTICLE'
        : 'UNPUBLISH_ARTICLE'
      : 'UPDATE_ARTICLE';

    await this.logActivity({
      actorId,
      actorEmail,
      action,
      targetId: article.id,
      detail: `${action === 'UPDATE_ARTICLE' ? 'Updated' : action === 'PUBLISH_ARTICLE' ? 'Published' : 'Unpublished'} article '${article.title}' (${article.slug})`,
      ip,
    });

    return article;
  }

  async remove(id: string, actorId?: string | null, actorEmail?: string | null, ip?: string | null) {
    const item = await this.prisma.article.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Article not found');
    await this.prisma.article.delete({ where: { id } });

    await this.logActivity({
      actorId,
      actorEmail,
      action: 'DELETE_ARTICLE',
      targetId: id,
      detail: `Deleted article '${item.title}' (${item.slug})`,
      ip,
    });

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
