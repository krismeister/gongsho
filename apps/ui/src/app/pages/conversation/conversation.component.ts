import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentModels, ConversationSummary } from '@gongsho/types';
import { map, Observable } from 'rxjs';
import { ConversationDialogListComponent } from '../../components/conversation/conversation-dialog-list.component';
import { ConversationTextareaComponent } from '../../components/conversation/conversation-textarea.component';
import { ConversationService } from '../../services/conversation.service';
@Component({
  selector: 'app-conversation',
  template: `
    <div class="container mx-auto px-4">
      <h2>Conversation {{(conversation$ | async)?.title}}</h2>
      <app-conversation-dialog-list [conversationId]="conversationId"></app-conversation-dialog-list>
      <app-conversation-textarea (submitMessage)="handleSubmit($event)"></app-conversation-textarea>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ConversationDialogListComponent, ConversationTextareaComponent],
})
export class ConversationComponent implements OnInit {
  conversationId: string;
  conversation$: Observable<ConversationSummary>;

  constructor(private route: ActivatedRoute, private conversationService: ConversationService) {
    this.conversationId = '';
    this.conversation$ = this.conversationService.getConversation(this.conversationId).pipe(map(data => data.summary))
  }

  ngOnInit() {
    this.conversationId = this.route.snapshot.paramMap.get('id') || '';
  }

  handleSubmit(message: { message: string, model: AgentModels }) {
    this.conversationService.addUserInput(this.conversationId, message.message, message.model).subscribe();
  }
}
