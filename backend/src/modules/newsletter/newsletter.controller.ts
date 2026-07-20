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
  subscribe(@Body() dto: SubscribeDto) {
    return this.service.subscribe(dto);
  }

  @Public()
  @SkipCsrf()
  @Post('unsubscribe')
  unsubscribe(@Body('token') token: string) {
    return this.service.unsubscribe(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-subscription')
  getMySubscription(@Req() req: any) {
    return this.service.getMySubscription(req.user?.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unsubscribe-me')
  unsubscribeMe(@Req() req: any) {
    return this.service.unsubscribeMe(req.user?.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resubscribe-me')
  resubscribeMe(@Req() req: any) {
    return this.service.resubscribeMe(req.user?.email);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('subscribers')
  getSubscribers(@Query('all') all?: string) {
    return this.service.getSubscribers(all !== 'true');
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Delete('subscribers/:id')
  deleteSubscriber(@Param('id') id: string) {
    return this.service.deleteSubscriber(id);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('campaigns')
  getCampaigns() {
    return this.service.getCampaigns();
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('campaigns/send')
  sendCampaign(@Body() dto: SendCampaignDto) {
    return this.service.sendCampaign(dto);
  }
}
