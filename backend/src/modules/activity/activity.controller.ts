import { Controller, Get, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ListActivityDto } from './dto/list-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Get()
  @RequirePermissions('audit:read')
  list(@Query() query: ListActivityDto) {
    return this.activity.list(query);
  }
}
