import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConversationSummary, DialogueData } from '@gongsho/types';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private dialogSubject = new Subject<string>();
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getConversation(id: string) {
    return this.http.get<DialogueData[]>(`${this.apiUrl}/conversations/${id}`);
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

  // Helper method to emit new messages (we'll use this later)
  emitMessage(message: string) {
    this.dialogSubject.next(message);
  }
} 