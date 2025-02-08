import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post('conversations')
  createConversation(@Body() body: { input?: string }) {
    return this.conversationsService.createConversation(body.input);
  }

  @Post('conversations/:id/user-input')
  addUserInput(@Param('id') id: string, @Body() body: { input: string }) {
    return this.conversationsService.addUserInput(id, body.input);
  }
}
