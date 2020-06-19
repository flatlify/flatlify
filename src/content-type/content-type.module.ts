import { Module } from '@nestjs/common';
import { ContentTypeController } from './content-type.controller';
import { ContentTypeService } from './content-type.service';
import { GitDbService } from 'src/git-db/git-db.service';

@Module({
  controllers: [ContentTypeController],
  providers: [ContentTypeService],
  imports: [GitDbService],
})
export class ContentTypeModule {}
