import { Module } from '@nestjs/common';
import { ContentTypeController } from './content-type.controller';
import { ContentTypeService } from './content-type.service';

@Module({
  controllers: [ContentTypeController],
  providers: [ContentTypeService]
})
export class ContentTypeModule {}
