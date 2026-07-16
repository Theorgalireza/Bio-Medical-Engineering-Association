import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { TrackVisitDto } from './dto/track-visit.dto';
import { Public } from '../../common/decorators/public.decorator';
import { SkipCsrf } from '../../common/decorators/skip-csrf.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  // ثبت بازدید - عمومی، بدون نیاز به JWT و بدون بررسی CSRF
  @Public()
  @SkipCsrf()
  @Post('track')
track(
  @Body() dto: TrackVisitDto,
  @Req() req: Request,
  @CurrentUser() user?: { id: string },
) {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    undefined;

  const userAgent = req.headers['user-agent'];

  return this.service.track(dto.path, ip, userAgent, user?.id);
}

  // آمار کلی داشبورد - فقط OWNER
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  getStats() {
    return this.service.getStats();
  }
}
