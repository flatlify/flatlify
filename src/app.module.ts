import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';
import { ContentTypeModule } from './content-type/content-type.module';
import { GitDBService } from './git-db/git-db.service';
import { GitDBModule } from './git-db/git-db.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    GitDBModule,
    ContentModule,
    ContentTypeModule,
  ],
  controllers: [],
  providers: [GitDBService],
})
export class AppModule {}
