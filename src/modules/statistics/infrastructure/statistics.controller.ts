import { Controller, Get, UseGuards } from '@nestjs/common';

import { SessionGuard } from '../../auth/guards/session.guard';
import { Roles } from '../../users/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../users/infrastructure/guards/role.guard';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Roles('ADMIN')
  @UseGuards(SessionGuard, RolesGuard)
  @Get('counts')
  async getCounts() {
    return await this.statisticsService.getCounts();
  }
}
