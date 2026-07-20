import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Security headers (Task 04/15).
  app.use(helmet());
  app.use(cookieParser());
  app.set('trust proxy', 1); // real client IP behind Render/CDN

  // CORS + Origin allow-list — only our own sites may call the API.
  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins, credentials: true, methods: ['GET', 'POST', 'PATCH', 'DELETE'] });

  // Global input validation: strip unknown props, reject extras, coerce types.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('api');

  // Interactive API docs at /api/docs (guarded off in production unless
  // ENABLE_SWAGGER=true, so the endpoint map isn't public by default).
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Ramest Technolabs API')
      .setDescription('Admin, blog CMS, newsletter, leads, media and SEO APIs.')
      .setVersion('1.0')
      .addBearerAuth() // paste the accessToken from /auth/login into "Authorize"
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // Graceful shutdown: close HTTP server + Prisma connections on SIGTERM
  // (Render/Docker send SIGTERM on deploy and scale-down).
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, '0.0.0.0'); // bind all interfaces for containers
  Logger.log(`API listening on :${port}/api`, 'Bootstrap');
}

void bootstrap();
