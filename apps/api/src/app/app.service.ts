import { Injectable } from '@nestjs/common';
import { Conversations } from '@gongsho/core';
import { ConversationSummary } from '@gongsho/types';

@Injectable()
export class AppService {

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getConversations(): ConversationSummary[] {
    return Conversations.getInstance().getConversationSummaries();
  }
}
