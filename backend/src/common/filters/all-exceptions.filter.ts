import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

/**
 * Single error shape for the whole API. Maps known errors to sane status codes
 * and never leaks stack traces or Prisma internals to the client (OWASP:
 * improper error handling / information exposure).
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      message = typeof body === 'string' ? body : ((body as any).message ?? message);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 unique violation -> 409; P2025 not found -> 404
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'A record with these details already exists';
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = 'Database request error';
      }
    }

    // Log the full detail server-side; return only the safe shape.
    if (status >= 500) {
      this.logger.error(`${req.method} ${req.url}`, exception as any);
    }

    res.status(status).json({
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
