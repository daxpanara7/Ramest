import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** The authenticated principal attached to the request by JwtAuthGuard. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

/** Injects the current authenticated user into a handler param. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    return ctx.switchToHttp().getRequest().user;
  },
);
