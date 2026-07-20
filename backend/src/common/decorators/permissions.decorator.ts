import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'requiredPermissions';

/**
 * Declares the permission keys a route requires (e.g. 'blog:create').
 * Enforced by PermissionsGuard against the user's resolved permission set.
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
