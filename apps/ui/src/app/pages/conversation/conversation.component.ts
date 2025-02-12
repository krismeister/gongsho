import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationDialogListComponent } from '../../components/conversation/conversation-dialog-list.component';
import { ConversationTextareaComponent } from '../../components/conversation/conversation-textarea.component';
import { ConversationService } from '../../services/conversation.service';
@Component({
  selector: 'app-new-conversation',
  template: `
    <div class="container mx-auto px-4">
      <h2>Conversation {{ conversationId }}</h2>
      <app-conversation-dialog-list [conversationId]="conversationId"></app-conversation-dialog-list>
      <app-conversation-textarea (submitMessage)="handleSubmit($event)"></app-conversation-textarea>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ConversationDialogListComponent, ConversationTextareaComponent],
})
export class ConversationComponent implements OnInit {
  conversationId: string;

  constructor(private route: ActivatedRoute, private conversationService: ConversationService) {
    this.conversationId = '';
  }

  ngOnInit() {
    this.conversationId = this.route.snapshot.paramMap.get('id') || '';
  }

  handleSubmit(message: string) {
    this.conversationService.addUserInput(this.conversationId, message).subscribe();
  }
}
