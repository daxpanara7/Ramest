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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { createReadStream } from 'fs';
import type { Response } from 'express';
import { MediaService, MAX_UPLOAD_BYTES } from './media.service';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { AuditService } from '../../common/audit/audit.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly media: MediaService,
    private readonly audit: AuditService,
  ) {}

  @RequirePermissions('media:write')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_UPLOAD_BYTES },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Query('alt') alt: string | undefined,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    const asset = await this.media.upload(file, user.id, alt);
    await this.audit.record({
      userId: user.id,
      action: 'media.upload',
      entity: 'MediaAsset',
      entityId: asset.id,
      ip,
    });
    return asset;
  }

  @RequirePermissions('media:read')
  @Get()
  list(
    @Query('mimeType') mimeType?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.media.list({
      mimeType,
      skip: skip !== undefined ? Number(skip) : undefined,
      take: take !== undefined ? Number(take) : undefined,
    });
  }

  /** Streams a locally stored file. Not used when cloud storage is configured. */
  @Public()
  @Get('file/:key')
  async serveFile(@Param('key') key: string, @Res() res: Response): Promise<void> {
    const { path, mimeType } = await this.media.resolveLocalFile(key);
    res.setHeader('Content-Type', mimeType);
    const stream = createReadStream(path);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(404).json({ statusCode: 404, message: 'File not found' });
      }
    });
    stream.pipe(res);
  }

  @RequirePermissions('media:write')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    const asset = await this.media.update(id, dto);
    await this.audit.record({
      userId: user.id,
      action: 'media.update',
      entity: 'MediaAsset',
      entityId: id,
      ip,
    });
    return asset;
  }

  @RequirePermissions('media:write')
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    await this.media.remove(id);
    await this.audit.record({
      userId: user.id,
      action: 'media.delete',
      entity: 'MediaAsset',
      entityId: id,
      ip,
    });
    return { ok: true };
  }
}
