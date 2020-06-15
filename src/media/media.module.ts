import { Module } from '@nestjs/common';
import { CoService } from './co/co.service';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  providers: [CoService, MediaService],
  controllers: [MediaController]
})
export class MediaModule {}
