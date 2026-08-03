import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('series')
  @RequirePermissions('dashboard:read')
  series(@Query('days') days?: string, @Query('months') months?: string) {
    // Clamped: an unbounded window would let a query scan the whole table.
    const d = Math.min(Math.max(Number(days) || 30, 7), 365);
    const m = Math.min(Math.max(Number(months) || 12, 3), 36);
    return this.dashboard.series(d, m);
  }

  @Get()
  @RequirePermissions('dashboard:read')
  get() {
    return this.dashboard.getStats();
  }
}
