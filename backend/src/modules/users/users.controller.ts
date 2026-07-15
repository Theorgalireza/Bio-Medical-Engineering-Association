import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('me/profile')
  updateMyProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto, req.user.id, req.user?.email ?? null, req.ip);
  }

  @Get()
  @Roles(Role.OWNER, Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(@Req() req: any, @Body() dto: CreateUserDto) {
    return this.usersService.create(dto, req.user.id, req.user?.email ?? null, req.ip);
  }

  @Get('stats/roles')
  @Roles(Role.OWNER, Role.ADMIN)
  countByRole() {
    return this.usersService.countByRole();
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/profile')
  @Roles(Role.OWNER, Role.ADMIN)
  updateProfile(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(id, dto, req.user.id, req.user?.email ?? null, req.ip);
  }

  @Patch(':id/status')
  @Roles(Role.OWNER, Role.ADMIN)
  updateStatus(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserStatusDto) {
    return this.usersService.updateStatus(id, dto.isActive, req.user.id, req.user?.email ?? null, req.ip);
  }

  @Patch(':id/role')
  @Roles(Role.OWNER, Role.ADMIN)
  updateRole(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserRoleDto) {
    return this.usersService.updateRole(id, dto, req.user.id, req.user?.email ?? null, req.ip);
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  remove(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id, req.user.id, req.user?.email ?? null, req.ip);
  }
}
