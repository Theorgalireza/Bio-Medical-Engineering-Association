// faculty.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto, UpdateFacultyDto, QueryFacultyDto } from './dto/faculty.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('faculty')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacultyController {
  constructor(private readonly service: FacultyService) {}

  @Get() @Public()
  findAll(@Query() query: QueryFacultyDto) { return this.service.findAll(query); }

  @Get(':id') @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Post() @Roles('ADMIN', 'OWNER')
  create(@Body() dto: CreateFacultyDto) { return this.service.create(dto); }

  @Patch(':id') @Roles('ADMIN', 'OWNER')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFacultyDto) { return this.service.update(id, dto); }

  @Delete(':id') @Roles('ADMIN', 'OWNER')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
