import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { ConversationTextareaComponent } from '../../components/conversation/conversation-textarea.component';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-new-conversation',
  template: `
    <app-conversation-textarea (submitMessage)="handleSubmit($event)"></app-conversation-textarea>
  `,
  standalone: true,
  imports: [CommonModule, ConversationTextareaComponent],
})
export class NewConversationComponent {
  constructor(
    private conversationService: ConversationService,
    private router: Router
  ) { }

  handleSubmit(message: string) {
    this.conversationService.createConversation(message).pipe(
      switchMap(response =>
        this.conversationService.addUserInput(response.id, message).pipe(
          map(() => response.id)
        )
      )
    ).subscribe({
      next: (conversationId) => {
        this.router.navigate(['/conversations', conversationId]);
      },
      error: (error) => {
        console.error('Error in conversation flow:', error);
        // Handle error appropriately
      }
    });
  }
} 