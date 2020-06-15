import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';
import { ContentModule } from './content/content.module';
import { ContentTypeModule } from './content-type/content-type.module';
import { GitDbService } from './git-db/git-db.service';
import { GitDbModule } from './git-db/git-db.module';

@Module({
  imports: [MediaModule, ContentModule, ContentTypeModule, GitDbModule],
  controllers: [AppController],
  providers: [AppService, GitDbService],
})
export class AppModule {}
