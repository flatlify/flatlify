import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { GitDBModule } from 'src/git-db/git-db.module';

@Module({
  imports: [GitDBModule],
  providers: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
