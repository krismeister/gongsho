import { Conversations } from '@gongsho/core';
import { ConversationData, ConversationSummary } from '@gongsho/types';
import { Injectable } from '@nestjs/common';
@Injectable()
export class ConversationsService {

  async getConversations(): Promise<ConversationSummary[]> {
    await Conversations.getInstance().load();
    return Conversations.getInstance().getConversationSummaries();
  }

  async getConversation(id: string): Promise<ConversationData> {
    const conversation = await Conversations.getInstance().getConversation(id);
    const summary: ConversationSummary = await Conversations.getInstance().getConversationSummary(id);
    return {
      summary: summary,
      details: conversation.getConversationDetails(),
    };
  }

  async createConversation(input: string): Promise<ConversationSummary> {
    if (!input) {
      throw new Error('Input is required');
    }
    const conversation = await Conversations.getInstance().createConversation(input);
    return conversation;
  }

  async addUserInput(id: string, input: string): Promise<{ message: string }> {
    if (!input || !id) {
      throw new Error('Input and id are required');
    }
    const conversation = await Conversations.getInstance().getConversation(id);
    await conversation.addUserInput(input);
    return { message: 'success' };
  }

}
