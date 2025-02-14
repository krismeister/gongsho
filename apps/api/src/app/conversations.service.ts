import { Conversations } from '@gongsho/core';
import { ConversationData, ConversationSummary, DialogueData } from '@gongsho/types';
import { Injectable } from '@nestjs/common';
import { concatMap, from, Observable } from 'rxjs';
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

  getDialogueDataStream(id: string): Observable<DialogueData> {
    return from(Conversations.getInstance().getConversation(id)).pipe(
      concatMap(conversation => {
        return conversation.getDialogueDataStream();
      }),
    );
  }

  async generateChangelist(id: string): Promise<{ message: string }> {
    const conversation = await Conversations.getInstance().getConversation(id)
    await conversation.generateChangelist();
    return { message: 'success' };
  }

  // getAgentBusyStream(id: string): Observable<boolean> {
  //   return from(Conversations.getInstance().getConversation(id)).pipe(
  //     concatMap(conversation => {
  //       return conversation.getAgentBusyStream();
  //     }),
  //   );
  // }
}
