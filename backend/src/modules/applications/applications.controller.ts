import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Throttle } from '@nestjs/throttler';
import { createReadStream } from 'fs';
import type { Request, Response } from 'express';
import {
  ApplicationsService,
  ALLOWED_RESUME_MIME,
  MAX_RESUME_BYTES,
} from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ListApplicationsQueryDto } from './dto/list-applications-query.dto';
import { ExportApplicationsQueryDto } from './dto/export-applications-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applications: ApplicationsService) {}

  /**
   * Public endpoint the careers "Apply Now" form posts to, as
   * multipart/form-data with an optional `resume` file part.
   *
   * Throttled harder than the contact form (3/min per IP): a real person
   * applies once, and each submission costs a file write.
   */
  @Public()
  @Post()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_RESUME_BYTES, files: 1 },
      // First gate on type. The service checks again — this only saves us
      // buffering a 5 MB file we were never going to keep.
      fileFilter: (_req, file, cb) =>
        cb(null, Boolean(ALLOWED_RESUME_MIME[file.mimetype])),
    }),
  )
  async submit(
    @Body() dto: CreateApplicationDto,
    @UploadedFile() resume: Express.Multer.File | undefined,
    @Ip() ip: string,
    @Req() req: Request,
  ) {
    const country =
      (req.headers['x-vercel-ip-country'] as string) ||
      (req.headers['cf-ipcountry'] as string) ||
      undefined;

    const result = await this.applications.create(dto, resume, {
      ip,
      country,
      userAgent: req.headers['user-agent'],
    });

    // Same response whether or not it was spam-scored — never tell a bot.
    return {
      ok: true,
      id: result.id,
      message:
        'Thanks — your application has been received. We review every one and will be in touch if there is a fit.',
    };
  }

  /** Admin paginated list with status/search/position filters. */
  @RequirePermissions('application:read')
  @Get()
  list(@Query() query: ListApplicationsQueryDto) {
    return this.applications.list(query);
  }

  /** CSV export. Declared before `:id` so Nest does not read it as an id. */
  @RequirePermissions('application:read')
  @Get('export')
  async export(
    @Query() query: ExportApplicationsQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    const csv = await this.applications.exportCsv(query.status);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
    res.send(csv);
  }

  /** Counts by status + the list of positions applied for. Before `:id`. */
  @RequirePermissions('application:read')
  @Get('stats')
  stats() {
    return this.applications.stats();
  }

  /**
   * Resume download. Behind `application:read` rather than @Public — a CV is
   * personal data, so unlike media it never gets an unauthenticated URL.
   */
  @RequirePermissions('application:read')
  @Get(':id/resume')
  async resume(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { path, mimeType, filename } = await this.applications.resolveResume(id);
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename.replace(/"/g, '')}"`,
    );
    // Never let a proxy or browser cache someone's CV.
    res.setHeader('Cache-Control', 'private, no-store');
    const stream = createReadStream(path);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(404).json({ statusCode: 404, message: 'File not found' });
      }
    });
    stream.pipe(res);
  }

  /** Submission + every status change, oldest first. Before `:id`. */
  @RequirePermissions('application:read')
  @Get(':id/history')
  history(@Param('id') id: string) {
    return this.applications.history(id);
  }

  /** Single application detail for the admin view. */
  @RequirePermissions('application:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applications.findOne(id);
  }

  /** Admin edit: status / adminNotes. Audited. */
  @RequirePermissions('application:write')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    return this.applications.update(id, dto, user, ip);
  }

  /** Soft delete (and removes the stored CV). Audited. */
  @RequirePermissions('application:write')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.applications.remove(id, user, ip);
  }
}
