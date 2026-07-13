// publications.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto, QueryPublicationDto } from './dto/publication.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('publications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PublicationsController {
  constructor(private readonly service: PublicationsService) {}

  @Get() @Public()
  findAll(@Query() query: QueryPublicationDto) { return this.service.findAll(query); }

  @Get(':id') @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Post() @Roles('ADMIN', 'OWNER', 'CONTENT_EDITOR')
  create(@Body() dto: CreatePublicationDto) { return this.service.create(dto); }

  @Patch(':id') @Roles('ADMIN', 'OWNER', 'CONTENT_EDITOR')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePublicationDto) { return this.service.update(id, dto); }

  @Delete(':id') @Roles('ADMIN', 'OWNER')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
