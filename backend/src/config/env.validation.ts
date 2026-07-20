import { plainToInstance } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

/**
 * Fail-fast environment validation. The process refuses to boot if a required
 * variable is missing or malformed, so misconfiguration surfaces at deploy
 * time rather than as a runtime 500 later.
 */
class EnvVars {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV!: string;

  @IsNotEmpty({ message: 'DATABASE_URL is required' })
  @IsString()
  DATABASE_URL!: string;

  // Required in production; optional in dev so local boot is frictionless.
  @IsOptional()
  @IsString()
  JWT_ACCESS_SECRET?: string;

  @IsOptional()
  @IsString()
  JWT_REFRESH_SECRET?: string;

  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(
    EnvVars,
    { NODE_ENV: 'development', ...config },
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length) {
    throw new Error(
      `Invalid environment configuration:\n${errors
        .map((e) => `  - ${Object.values(e.constraints ?? {}).join(', ')}`)
        .join('\n')}`,
    );
  }

  // Secrets are optional in dev but mandatory in production.
  if (validated.NODE_ENV === 'production') {
    for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] as const) {
      if (!validated[key]) throw new Error(`${key} is required in production`);
    }
  }
  return validated;
}
