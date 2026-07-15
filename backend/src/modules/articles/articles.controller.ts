// articles.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, QueryArticleDto } from './dto/article.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, User } from '@prisma/client';

@Controller('articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Get()
  @Public()
  findAll(@Query() query: QueryArticleDto) {
    return this.service.findAll(query);
  }

  @Get(':slug')
  @Public()
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Post()
  @Roles(Role.ADMIN, Role.OWNER, Role.CONTENT_EDITOR)
  create(@Body() dto: CreateArticleDto, @CurrentUser() user: User, @Req() req: any) {
    return this.service.create(dto, user, req.user?.id ?? null, req.user?.email ?? null, req.ip);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.CONTENT_EDITOR)
  update(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateArticleDto) {
    return this.service.update(id, dto, req.user.id, req.user?.email ?? null, req.ip);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.CONTENT_EDITOR)
  remove(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id, req.user.id, req.user?.email ?? null, req.ip);
  }
}
