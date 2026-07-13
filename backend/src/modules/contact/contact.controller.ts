// contact.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto, QueryContactDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

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
  create(@Body() dto: CreateContactDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContactDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
