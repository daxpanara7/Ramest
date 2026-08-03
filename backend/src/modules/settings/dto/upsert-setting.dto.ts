import { Allow, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * A single setting. `value` is deliberately untyped (Prisma Json) because
 * each key stores a different shape — a string for company.name, a boolean
 * for security.twoFactor, an object for email.smtp.
 */
export class UpsertSettingDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  // Dotted namespace, camelCase segments allowed — keeps the key space
  // groupable and stops a typo creating an orphan setting nothing reads.
  // Segments must START lowercase but may contain capitals, so natural keys
  // like "email.fromName" and "security.sessionHours" are legal.
  @Matches(/^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/, {
    message: 'key must be a dotted lowercase namespace, e.g. "company.name"',
  })
  key!: string;

  // @Allow marks the property known WITHOUT constraining it. Any JSON value
  // is legal here, but the global pipe runs forbidNonWhitelisted, which
  // rejects outright any property carrying no decorator at all — an
  // undecorated `value` fails with "property value should not exist".
  @Allow()
  value!: unknown;
}
