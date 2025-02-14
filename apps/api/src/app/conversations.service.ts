import { Conversations } from '@gongsho/core';
import { ConversationData, ConversationSummary, DialogueData } from '@gongsho/types';
import { Injectable } from '@nestjs/common';
import { concatMap, from, Observable, tap, throwError } from 'rxjs';
@Injectable()
export class ConversationsService {

  async getConversations(): Promise<ConversationSummary[]> {
    await Conversations.load();
    return Conversations.getConversationSummaries();
  }

  async getConversation(id: string): Promise<ConversationData> {
    const conversation = await Conversations.getConversation(id);
    const summary: ConversationSummary = await Conversations.getConversationSummary(id);
    return {
      summary: summary,
      details: conversation.getConversationDetails(),
    };
  }

  async createConversation(input: string): Promise<ConversationSummary> {
    if (!input) {
      throw new Error('Input is required');
    }
    const summary = await Conversations.createConversation(input);
    const conversation = await Conversations.getConversation(summary.id);
    conversation.addUserInput(input);
    return summary;
  }

  async addUserInput(id: string, input: string): Promise<{ message: string }> {
    if (!input || !id) {
      throw new Error('Input and id are required');
    }
    const conversation = await Conversations.getConversation(id);
    await conversation.addUserInput(input);
    return { message: 'success' };
  }

  getDialogueDataStream(id: string): Observable<DialogueData> {
    return from(Conversations.getConversation(id)).pipe(
      concatMap(conversation => {
        if (!conversation) {
          console.error('Conversation not found');
          return throwError(() => new Error('Conversation not found'));
        }
        return conversation.getDialogueDataStream()
          .pipe(
            tap(dialogueData => {
              console.log('dialogueData', dialogueData.id)
            }),
          );
      }),
    );
  }

  async requestChangeLog(id: string): Promise<{ message: string }> {
    const conversation = await Conversations.getConversation(id)
    await conversation.requestChangeLog();
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
