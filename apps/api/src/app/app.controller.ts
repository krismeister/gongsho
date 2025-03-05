import { AgentModels, DialogData, DialogFragment } from '@gongsho/types';
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
  createConversation(@Body() body: { input: string, model: AgentModels }) {
    if (!body.input) {
      throw new Error('Input is required');
    }
    return this.conversationsService.createConversation(body.input, body.model);
  }

  @Post('conversations/:id/user-input')
  addUserInput(@Param('id') id: string, @Body() body: { input: string, model: AgentModels }) {
    return this.conversationsService.addUserInput(id, body.input, body.model);
  }

  @Sse('conversations/:id/stream')
  getDialogStream(@Param('id') id: string): Observable<MessageEvent<DialogData>> {
    return this.conversationsService.getDialogDataStream(id).pipe(
      map((dialogData) => ({
        data: dialogData
      } as MessageEvent<DialogData>))
    );
  }

  @Sse('conversations/:id/stream/:dialogId')
  getFragmentStream(@Param('id') id: string, @Param('dialogId') dialogId: string): Observable<MessageEvent<DialogData | DialogFragment>> {
    return this.conversationsService.getFragmentStream(id, dialogId).pipe(
      map((dialogData) => ({
        data: dialogData
      } as MessageEvent<DialogData | DialogFragment>))
    );
  }

  @Post('conversations/:id/request-changelist')
  requestChangelist(@Param('id') id: string) {
    return this.conversationsService.requestChangelist(id);
  }

  @Post('conversations/:id/apply-changelist')
  applyChangelist(@Param('id') id: string, @Body() body: { changelistId: string }) {
    return this.conversationsService.applyChangelist(id, body.changelistId);
  }
}
