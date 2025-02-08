import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversation-detail',
  template: `
    <div class="conversation-detail">
      <h2>Conversation {{ conversationId }}</h2>
      <!-- Add your conversation UI here -->
    </div>
  `
})
export class ConversationDetailComponent implements OnInit {
  conversationId: string;

  constructor(private route: ActivatedRoute) {
    this.conversationId = '';
  }

  ngOnInit() {
    this.conversationId = this.route.snapshot.paramMap.get('id') || '';
  }
}
