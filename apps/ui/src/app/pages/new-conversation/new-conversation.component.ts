import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationTextareaComponent } from '../../components/conversation/conversation-textarea.component';
import { ConversationService } from '../../services/conversation.service';
import { UserPreferenceService } from '../../services/user-preference.service';

@Component({
  selector: 'app-new-conversation',
  template: `
    <div class="container mx-auto px-4">
      <h2>New Conversation</h2>
      <app-conversation-textarea (submitMessage)="handleSubmit($event)"></app-conversation-textarea>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ConversationTextareaComponent],
})
export class NewConversationComponent {
  constructor(
    private conversationService: ConversationService,
    private router: Router,
    private userPreferenceService: UserPreferenceService
  ) { }

  handleSubmit(data: { message: string, onSuccess: () => void }) {
    this.conversationService.createConversation(data.message, this.userPreferenceService.getSelectedModel()).pipe(
    ).subscribe({
      next: (conversationSummary) => {
        data.onSuccess(); // Clear the textarea
        this.router.navigate(['/conversations', conversationSummary.id]);
      },
      error: (error) => {
        console.error('Error in conversation flow:', error);
        // Handle error appropriately
      }
    });
  }
} 