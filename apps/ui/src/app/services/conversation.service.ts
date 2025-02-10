import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConversationData, ConversationSummary } from '@gongsho/types';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private dialogSubject = new Subject<string>();
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getConversation(id: string): Observable<ConversationData> {
    return this.http.get<ConversationData>(`${this.apiUrl}/conversations/${id}`);
  }

  createConversation(input: string): Observable<ConversationSummary> {
    return this.http.post<ConversationSummary>(`${this.apiUrl}/conversations`, { input });
  }

  addUserInput(conversationId: string, input: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/conversations/${conversationId}/user-input`, { input });
  }


  // addUserDialog(conversationId?: string): Observable<{ data: { message: string } }> {
  //   // Here you would typically implement the logic to handle the conversation
  //   // For now, we're just returning the Subject as an Observable
  //   return interval(1000)
  //     .pipe(map((_) => ({ data: { message: 'Hello from SSE!' } })))
  //   // return this.dialogSubject.asObservable();
  // }

} 