import { Conversations, writeChangelistToFiles } from '@gongsho/core';
import { AgentModels, ConversationData, ConversationSummary, DialogData, DialogFragment } from '@gongsho/types';
import { Injectable } from '@nestjs/common';
import { concatMap, finalize, from, Observable, tap, throwError } from 'rxjs';
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

  async createConversation(input: string, agent: AgentModels): Promise<ConversationSummary> {
    if (!input) {
      throw new Error('Input is required');
    }
    const summary = await Conversations.createConversation(input);
    const conversation = await Conversations.getConversation(summary.id);
    conversation.addUserInput(input, agent);
    return summary;
  }

  async addUserInput(id: string, input: string, agent: AgentModels): Promise<{ message: string }> {
    if (!input || !id) {
      throw new Error('Input and id are required');
    }
    const conversation = await Conversations.getConversation(id);
    await conversation.addUserInput(input, agent);
    return { message: 'success' };
  }

  getDialogDataStream(id: string): Observable<DialogData | DialogFragment> {
    return from(Conversations.getConversation(id)).pipe(
      concatMap(conversation => {
        if (!conversation) {
          console.error('Conversation not found');
          return throwError(() => new Error('Conversation not found'));
        }
        return conversation.getDialogDataStream()
          .pipe(
            tap(dialogData => {
              console.log('streaming dialog:', dialogData.id)
            }),
          );
      }),
    );
  }

  getFragmentStream(conversationId: string, dialogId: string): Observable<DialogData | DialogFragment> {
    return from(Conversations.getConversation(conversationId)).pipe(
      concatMap(conversation => {
        if (!conversation) {
          console.error('Conversation not found');
          return throwError(() => new Error('Conversation not found'));
        }
        return conversation.getFragmentStream$(dialogId).pipe(
          finalize(() => {
            console.log(`Closing fragment stream for dialog ${dialogId}`);
          })
        );
      }),
    );
  }

  async requestChangelist(id: string): Promise<{ message: string }> {
    const conversation = await Conversations.getConversation(id)
    await conversation.requestChangelist();
    return { message: 'success' };
  }

  async applyChangelist(id: string, changelistId: string): Promise<{ message: string }> {
    const conversation = await Conversations.getConversation(id)
    const changeList = await conversation.getChangelistResponse(changelistId);
    await writeChangelistToFiles(changeList);
    await conversation.addFiles(changeList.changes.map(change => change.file.relativePath));
    await conversation.addInfoDialog('changelist-applied');
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
