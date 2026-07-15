// gallery.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe, Request } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto, UpdateGalleryDto, QueryGalleryDto } from './dto/gallery.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('gallery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GalleryController {
  constructor(private readonly service: GalleryService) {}

  @Get() @Public()
  findAll(@Query() query: QueryGalleryDto) { return this.service.findAll(query); }

  @Get(':id') @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Post() @Roles('ADMIN', 'OWNER', 'CONTENT_EDITOR')
  create(@Body() dto: CreateGalleryDto, @Request() req: any) { return this.service.create(dto, req.user?.id, req.user?.id ?? null, req.user?.email ?? null, req.ip); }

  @Patch(':id') @Roles('ADMIN', 'OWNER', 'CONTENT_EDITOR')
  update(@Request() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateGalleryDto) { return this.service.update(id, dto, req.user.id, req.user?.email ?? null, req.ip); }

  @Delete(':id') @Roles('ADMIN', 'OWNER','CONTENT_EDITOR')
  remove(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id, req.user.id, req.user?.email ?? null, req.ip); }
}
