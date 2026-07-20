import { Injectable } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { ListActivityDto } from './dto/list-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private readonly repo: ActivityRepository) {}

  list(query: ListActivityDto) {
    return this.repo.findMany({
      userId: query.userId,
      action: query.action,
      skip: query.skip,
      take: query.take,
    });
  }
}
