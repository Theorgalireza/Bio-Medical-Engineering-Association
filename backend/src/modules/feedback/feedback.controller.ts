// feedback.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SkipCsrf } from '../../common/decorators/skip-csrf.decorator';

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
  @SkipCsrf()
  create(@Req() req: any, @Body() dto: CreateFeedbackDto) { return this.service.create(dto, null, null, req.ip); }

  @Patch(':id') @Roles('ADMIN', 'OWNER')
  update(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFeedbackDto) { return this.service.update(id, dto, req.user.id, req.user?.email ?? null, req.ip); }

  @Delete(':id') @Roles('ADMIN', 'OWNER')
  remove(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id, req.user.id, req.user?.email ?? null, req.ip); }
}
