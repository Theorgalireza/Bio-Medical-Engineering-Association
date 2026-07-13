// feedback.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('feedback')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @Get() @Roles('ADMIN', 'OWNER')
  findAll(@Query() query: QueryFeedbackDto) { return this.service.findAll(query); }

  @Get('approved') @Public()
  findApproved() { return this.service.findAll({ approved: true }); }

  @Get(':id') @Roles('ADMIN', 'OWNER')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Post() @Public()
  create(@Body() dto: CreateFeedbackDto) { return this.service.create(dto); }

  @Patch(':id') @Roles('ADMIN', 'OWNER')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFeedbackDto) { return this.service.update(id, dto); }

  @Delete(':id') @Roles('ADMIN', 'OWNER')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
