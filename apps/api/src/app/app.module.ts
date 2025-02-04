import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config.service';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ConfigService, ConversationsService],
})
export class AppModule {}
