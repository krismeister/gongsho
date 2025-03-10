import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { ModelSelectorComponent } from '../buttons/model-selector.component';

@Component({
  selector: 'app-conversation-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmInputDirective, HlmBadgeDirective, ModelSelectorComponent],
  template: `
    <div class="flex flex-col">
      <div class="flex-1 flex flex-row gap-2 justify-end py-2">

        <app-model-selector class="mr-auto" />
        <span hlmBadge variant="outline" >Ctrl-Enter - line break</span>
        <span hlmBadge variant="secondary" >Enter - submit</span>
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
export class ConversationTextareaComponent {
  @Output() submitMessage = new EventEmitter<{
    message: string,
    onSuccess: () => void
  }>();
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
      this.submitMessage.emit({
        message: this.message.trim(),
        onSuccess: () => {
          this.message = ''; // Only clear when parent signals success
        }
      });
    }
  }
} 