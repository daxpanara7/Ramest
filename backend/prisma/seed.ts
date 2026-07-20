/**
 * Idempotent seed: permission catalogue, baseline roles, and the first admin.
 * Safe to run repeatedly (upserts). Run: npm run seed
 */
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// resource:action — the full permission surface the API enforces.
const PERMISSIONS: Record<string, string> = {
  'dashboard:read': 'View admin dashboard',
  'user:read': 'View users',
  'user:write': 'Create / update users',
  'user:delete': 'Delete users',
  'role:read': 'View roles',
  'role:write': 'Manage roles & permissions',
  'blog:read': 'View blog posts',
  'blog:write': 'Create / edit blog posts',
  'blog:publish': 'Publish / schedule posts',
  'blog:delete': 'Delete blog posts',
  'newsletter:read': 'View subscribers',
  'newsletter:write': 'Manage subscribers',
  'lead:read': 'View contact leads',
  'lead:write': 'Update leads & notes',
  'media:read': 'View media library',
  'media:write': 'Upload / delete media',
  'seo:read': 'View SEO command center',
  'settings:read': 'View settings',
  'settings:write': 'Change settings',
  'audit:read': 'View audit logs',
};

const ROLES: Record<string, string[] | '*'> = {
  admin: '*', // every permission
  editor: [
    'dashboard:read',
    'blog:read', 'blog:write', 'blog:publish', 'blog:delete',
    'media:read', 'media:write',
    'newsletter:read', 'newsletter:write',
    'lead:read', 'lead:write',
    'seo:read',
  ],
  viewer: ['dashboard:read', 'blog:read', 'lead:read', 'newsletter:read', 'seo:read'],
};

async function main() {
  // 1. Permissions
  for (const [key, label] of Object.entries(PERMISSIONS)) {
    await prisma.permission.upsert({
      where: { key },
      update: { label },
      create: { key, label },
    });
  }
  const allPerms = await prisma.permission.findMany();
  const byKey = new Map(allPerms.map((p) => [p.key, p.id]));

  // 2. Roles + their permissions
  for (const [name, keys] of Object.entries(ROLES)) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
    const grantKeys = keys === '*' ? Object.keys(PERMISSIONS) : keys;
    for (const key of grantKeys) {
      const permissionId = byKey.get(key);
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId } },
        update: {},
        create: { roleId: role.id, permissionId },
      });
    }
  }

  // 3. First admin from env
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password) {
    console.log('⚠ ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD not set — skipping admin seed');
  } else {
    const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'admin' } });
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: 'Administrator', passwordHash },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
      update: {},
      create: { userId: user.id, roleId: adminRole.id },
    });
    console.log(`✔ admin ready: ${email}`);
  }

  console.log(`✔ seeded ${allPerms.length} permissions, ${Object.keys(ROLES).length} roles`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
