import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service.js';
import { CreateRouteDto } from './create-route.dto.js';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@UseGuards(SupabaseAuthGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routes: RoutesService) {}

  @Post()
  create(@CurrentUser() userId: string, @Body() dto: CreateRouteDto) {
    return this.routes.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.routes.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.routes.findOne(userId, id);
  }
}
