import { Injectable } from '@nestjs/common';
import { Conversations } from '@gongsho/core';
import { ConversationSummary } from '@gongsho/types';
@Injectable()
export class ConversationsService {

  async getConversations(): Promise<ConversationSummary[]> {
    await Conversations.getInstance().load();
    return Conversations.getInstance().getConversationSummaries();
  }
}
