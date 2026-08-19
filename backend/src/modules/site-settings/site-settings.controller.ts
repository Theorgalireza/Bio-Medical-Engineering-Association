import { Controller, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { UpsertSettingDto, BulkUpsertDto } from './dto/site-settings.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('site-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  @Get()
  @Public()
  findAll() { return this.service.findAll(); }

  @Put(':key')
  @Roles('ADMIN', 'OWNER')
  upsert(@Param('key') key: string, @Body() dto: UpsertSettingDto, @Req() req: any) {
    return this.service.upsert(key, dto.value, req.user?.id, req.user?.email ?? null, req.ip);
  }

  @Put()
  @Roles('ADMIN', 'OWNER')
  bulkUpsert(@Body() dto: BulkUpsertDto, @Req() req: any) {
    return this.service.bulkUpsert(dto.settings, req.user?.id, req.user?.email ?? null, req.ip);
  }
}
