import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from '../../components/conversation/conversation.component';

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.component.html',
  standalone: true,
  imports: [CommonModule, ConversationComponent],
})
export class NewConversationComponent {
  // Add your component logic here
} 