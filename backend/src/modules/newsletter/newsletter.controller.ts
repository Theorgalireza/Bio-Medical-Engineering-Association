import { Body, Controller, Get, Delete, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SendCampaignDto, SubscribeDto } from './dto/newsletter.dto';
import { Public } from '../../common/decorators/public.decorator';
import { SkipCsrf } from '../../common/decorators/skip-csrf.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}

  @Public()
  @SkipCsrf()
  @Post('subscribe')
  subscribe(@Body() dto: SubscribeDto, @Req() req: any) {
    return this.service.subscribe(dto, req.ip);
  }

  @Public()
  @SkipCsrf()
  @Post('unsubscribe')
  unsubscribe(@Body('token') token: string, @Req() req: any) {
    return this.service.unsubscribe(token, req.ip);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-subscription')
  getMySubscription(@Req() req: any) {
    return this.service.getMySubscription(req.user?.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unsubscribe-me')
  unsubscribeMe(@Req() req: any) {
    return this.service.unsubscribeMe(req.user?.email, req.ip);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resubscribe-me')
  resubscribeMe(@Req() req: any) {
    return this.service.resubscribeMe(req.user?.email, req.ip);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('subscribers')
  getSubscribers(@Query('all') all?: string) {
    return this.service.getSubscribers(all !== 'true');
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Delete('subscribers/:id')
  deleteSubscriber(@Param('id') id: string, @Req() req: any) {
    return this.service.deleteSubscriber(id, req.user?.id, req.user?.email ?? null, req.ip);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('subscribers/restore/:token')
  restoreSubscriber(@Param('token') token: string, @Req() req: any) {
    return this.service.restoreSubscriber(token, req.user?.id, req.user?.email ?? null, req.ip);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('campaigns')
  getCampaigns() {
    return this.service.getCampaigns();
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('campaigns/send')
  sendCampaign(@Body() dto: SendCampaignDto, @Req() req: any) {
    return this.service.sendCampaign(dto, req.user?.id, req.user?.email ?? null, req.ip);
  }
}
