import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { GitDbService } from 'src/git-db/git-db.service';
import { ContentController } from './content.controller';

@Module({
  providers: [ContentService],
  controllers: [ContentController],
  imports: [GitDbService],
})
export class ContentModule {}
