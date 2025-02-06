import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from './config.service';
import { ConversationsService } from './conversations.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly conversationsService: ConversationsService,
  ) { }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('config')
  getConfig() {
    return this.configService.getConfig();
  }

  @Get('conversations')
  getConversations() {
    return this.conversationsService.getConversations();
  }

  @Get('conversations/:id')
  getConversation(@Param('id') id: string) {
    return this.conversationsService.getConversation(id);
  }
}
