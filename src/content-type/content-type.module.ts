import { Module } from '@nestjs/common';
import { ContentTypeController } from './content-type.controller';
import { ContentTypeService } from './content-type.service';
import { GitDBModule } from '../git-db/git-db.module';

@Module({
  controllers: [ContentTypeController],
  providers: [ContentTypeService],
  imports: [GitDBModule],
})
export class ContentTypeModule {}
