import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmInputDirective, HlmBadgeDirective],
  template: `
    <div class="flex flex-col">
      <div class="flex-1 flex flex-row gap-2 justify-end py-2">
        <span hlmBadge variant="outline" class="font-light">Ctrl-Enter - line break</span>
        <span hlmBadge variant="secondary" class="font-light">Enter - submit</span>
      </div>
      <div class="flex-1 flex flex-col">
        <textarea 
          hlmInput
          [(ngModel)]="message" 
          (keydown.enter)="handleEnterKey($event)"
          placeholder="Type your message..."
          class="flex-1 min-h-[120px]"
          rows="3"
        ></textarea>
    </div>
  `
})
export class ConversationComponent {
  message = '';

  handleEnterKey(ev: Event) {
    const event = ev as KeyboardEvent;
    if (!event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  onSubmit() {
    if (this.message.trim()) {
      console.log('Message submitted:', this.message);
      // Add your submission logic here
      this.message = ''; // Clear the input after submission
    }
  }
} 