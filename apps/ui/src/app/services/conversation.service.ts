import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConversationData, ConversationSummary, DialogueData } from '@gongsho/types';
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

  createConversation(input: string): Observable<ConversationSummary> {
    return this.http.post<ConversationSummary>(`${this.apiUrl}/conversations`, { input });
  }

  addUserInput(conversationId: string, input: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/conversations/${conversationId}/user-input`, { input });
  }

  getDialogStream(conversationId: string): Observable<DialogueData> {
    return this.sseClient.stream(
      `${this.apiUrl}/conversations/${conversationId}/stream`
    ).pipe(
      map(event => {
        if (event.type === 'error') {
          throw new Error((event as MessageEvent).data);
        }
        const data = event as MessageEvent;
        return JSON.parse(data.data) as DialogueData;
      }),
      catchError(error => throwError(() => error)),
      filter(Boolean)
    );
  }

  requestChangelog(conversationId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/conversations/${conversationId}/request-changelog`, {});
  }

  applyChangelog(conversationId: string, changelogId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/conversations/${conversationId}/apply-changelog`, { changelogId });
  }

} 