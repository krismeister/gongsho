import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideListX } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-generate-changelog-button',
  standalone: true,
  imports: [
    NgIcon,
    HlmIconDirective,
    HlmButtonDirective
  ],
  providers: [
    provideIcons({ lucideListX })
  ],
  template: `
    <button hlmBtn (click)="generateChangelist()">
      <ng-icon hlm size="sm" class="mr-2" name="lucideListX" />
      Generate Changelist
    </button>
  `
})
export class GenerateChangelogButtonComponent {
  @Input() conversationId!: string;

  constructor(private conversationService: ConversationService) { }

  generateChangelist() {
    this.conversationService.requestChangelist(this.conversationId).subscribe(data => {
      console.log(data);
    });
  }
} 