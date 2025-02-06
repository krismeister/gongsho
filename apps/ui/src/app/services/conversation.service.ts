import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DialogueData } from '@gongsho/types';
import { interval, map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private dialogSubject = new Subject<string>();
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getConversation(id: string) {
    return this.http.get<DialogueData[]>(`${this.apiUrl}/conversations/${id}`);
  }

  addUserDialog(conversationId?: string): Observable<{ data: { message: string } }> {
    // Here you would typically implement the logic to handle the conversation
    // For now, we're just returning the Subject as an Observable
    return interval(1000)
      .pipe(map((_) => ({ data: { message: 'Hello from SSE!' } })))
    // return this.dialogSubject.asObservable();
  }

  // Helper method to emit new messages (we'll use this later)
  emitMessage(message: string) {
    this.dialogSubject.next(message);
  }
} 