// contact.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto, QueryContactDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SkipCsrf } from '../../common/decorators/skip-csrf.decorator';

@Controller('contact')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Get()
  @Roles('ADMIN', 'OWNER')
  findAll(@Query() query: QueryContactDto) { return this.service.findAll(query); }

  @Get(':id')
  @Roles('ADMIN', 'OWNER')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Post()
  @Public()
  @SkipCsrf()
  create(@Req() req: any, @Body() dto: CreateContactDto) { return this.service.create(dto, null, dto.email, req.ip); }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  update(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContactDto) { return this.service.update(id, dto, req.user.id, req.user?.email ?? null, req.ip); }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  remove(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id, req.user.id, req.user?.email ?? null, req.ip); }
}
