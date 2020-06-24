import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';
import { ContentModule } from './content/content.module';
import { ContentTypeModule } from './content-type/content-type.module';
import { GitDBService } from './git-db/git-db.service';
import { GitDBModule } from './git-db/git-db.module';

@Module({
  imports: [GitDBModule, ContentModule, MediaModule, ContentTypeModule],
  controllers: [AppController],
  providers: [GitDBService, AppService],
})
export class AppModule {}
