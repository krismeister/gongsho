import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgentModels, ConversationData, ConversationSummary, DialogData, DialogFragment } from '@gongsho/types';
import { SseClient } from 'ngx-sse-client';
import { Observable, catchError, filter, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = '/api';

  constructor(private http: HttpClient, private sseClient: SseClient) { }

  getConversation(id: string): Observable<ConversationData> {
    return this.http.get<ConversationData>(`${this.apiUrl}/conversations/${id}`);
  }

  createConversation(input: string, model: AgentModels): Observable<ConversationSummary> {
    return this.http.post<ConversationSummary>(`${this.apiUrl}/conversations`, { input, model });
  }

  addUserInput(conversationId: string, input: string, model: AgentModels): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/conversations/${conversationId}/user-input`, { input, model });
  }

  getDialogStream(conversationId: string): Observable<DialogData> {
    return this.sseClient.stream(
      `${this.apiUrl}/conversations/${conversationId}/stream`
    ).pipe(
      map(event => {
        if (event.type === 'error') {
          throw new Error((event as MessageEvent).data);
        }
        const data = event as MessageEvent;
        return JSON.parse(data.data) as DialogData;
      }),
      catchError(error => throwError(() => error)),
      filter(Boolean)
    );
  }

  getFragmentStream(conversationId: string, dialogId: string): Observable<DialogFragment | DialogData> {
    return this.sseClient.stream(
      `${this.apiUrl}/conversations/${conversationId}/stream/${dialogId}`, { keepAlive: false }
    ).pipe(
      map(event => {
        if (event.type === 'error') {
          throw new Error((event as MessageEvent).data);
        }
        const data = event as MessageEvent;
        return JSON.parse(data.data) as DialogFragment;
      }),
      catchError(error => throwError(() => error)),
    );
  }

  requestChangelist(conversationId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/conversations/${conversationId}/request-changelist`, {});
  }

  applyChangelist(conversationId: string, changelistId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/conversations/${conversationId}/apply-changelist`, { changelistId });
  }

} 