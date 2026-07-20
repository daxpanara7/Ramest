# Module conventions (follow exactly)

Reference implementation: `src/modules/auth/` and `src/modules/leads/`.

## Structure — one folder per module under `src/modules/<name>/`
```
<name>.module.ts        // wires controller + providers; imports nothing global
<name>.controller.ts    // routes, guards, DTO binding only — no business logic
<name>.service.ts       // business logic; calls repository, never Prisma directly
<name>.repository.ts    // ALL Prisma queries live here
dto/*.dto.ts            // class-validator DTOs, one per input shape
```

## Rules
- **Auth is global.** Every route requires a valid JWT by default. Do NOT add JwtAuthGuard yourself. Use `@Public()` only for genuinely open routes.
- **Authorize** every admin route with `@RequirePermissions('<resource>:<action>')` (import from `src/common/decorators/permissions.decorator`). Permission keys already seeded: `dashboard:read`, `user:read/write/delete`, `role:read/write`, `blog:read/write/publish/delete`, `newsletter:read/write`, `lead:read/write`, `media:read/write`, `seo:read`, `settings:read/write`, `audit:read`.
- **Current user**: `@CurrentUser() user: AuthUser` from `src/common/decorators/current-user.decorator`.
- **Audit** every mutation (create/update/delete/publish): inject `AuditService` (global, no import needed in module) and call `await this.audit.record({ userId: user.id, action: '<entity>.<verb>', entity, entityId, ip })`.
- **Prisma**: inject `PrismaService` (global). Respect soft delete — always filter `deletedAt: null` on reads; set `deletedAt` on delete, never hard-delete business rows.
- **Validation**: every input via a DTO with class-validator. Trim strings. Cap lengths. The global ValidationPipe already strips unknown fields and 400s on extras — rely on it.
- **Pagination**: list endpoints take `?skip=&take=` (cap take at 100) and `?search=` / filter params; return `{ items, total }`.
- **Errors**: throw Nest exceptions (`NotFoundException`, `ConflictException`, etc.). The global filter formats them. Never leak Prisma errors.
- **No app.module.ts edits** — the integrator wires your module import. Do NOT touch app.module.ts, schema.prisma, or any file under `src/common/`.
- Types: `strictNullChecks` is on. Double quotes, 2-space indent. Build must pass `npx tsc --noEmit`.

## Prisma models available (already migrated — do not change schema)
User, Role, Permission, UserRole, RolePermission, RefreshToken, BlogPost
(status: DRAFT/SCHEDULED/PUBLISHED/ARCHIVED; SEO fields metaTitle/metaDescription/
canonicalUrl/noindex/ogImageId; coverImageId; authorId; categoryId; PostTag),
Category, Tag, PostTag, NewsletterSubscriber (status PENDING/ACTIVE/UNSUBSCRIBED/
BOUNCED; verifyToken; verifiedAt), ContactLead (status NEW/CONTACTED/QUALIFIED/
WON/LOST/SPAM; adminNotes; assigneeId), MediaAsset, Setting (key/value Json),
ActivityLog.
