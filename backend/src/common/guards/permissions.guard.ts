import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import type { AuthUser } from '../decorators/current-user.decorator';

/**
 * Enforces @RequirePermissions. Runs after JwtAuthGuard, so request.user is
 * populated. A user needs ALL listed permissions (AND semantics).
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const user = ctx.switchToHttp().getRequest().user as AuthUser | undefined;
    if (!user) throw new ForbiddenException('Not authenticated');

    const granted = new Set(user.permissions);
    const missing = required.filter((p) => !granted.has(p));
    if (missing.length) {
      throw new ForbiddenException(`Missing permission: ${missing.join(', ')}`);
    }
    return true;
  }
}
