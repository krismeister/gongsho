import { DialogueData } from '@gongsho/types';
import { Body, Controller, Get, Param, Post, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  @Sse('conversations/:id/stream')
  getDialogStream(@Param('id') id: string): Observable<MessageEvent<DialogueData>> {
    return this.conversationsService.getDialogueDataStream(id).pipe(
      map((dialogData) => ({
        data: dialogData
      } as MessageEvent<DialogueData>))
    );
  }

  @Post('conversations/:id/request-changelog')
  requestChangelog(@Param('id') id: string) {
    return this.conversationsService.requestChangeLog(id);
  }
}
