import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { StorageService } from './storage.service';

// PrismaService and AuditService are global (PrismaModule / AuditModule in
// AppModule) — no need to import them here.
@Module({
  controllers: [MediaController],
  providers: [MediaService, MediaRepository, StorageService],
})
export class MediaModule {}
