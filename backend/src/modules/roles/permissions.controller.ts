import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

/** Read-only catalogue of every permission key in the system, for the role editor UI. */
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly roles: RolesService) {}

  @Get()
  @RequirePermissions('role:read')
  list() {
    return this.roles.listPermissions();
  }
}
