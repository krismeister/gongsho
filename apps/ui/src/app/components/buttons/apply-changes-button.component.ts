import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-apply-changes-button',
  standalone: true,
  imports: [
    NgIcon,
    HlmIconDirective,
    HlmButtonDirective
  ],
  providers: [
    provideIcons({ lucideCheck })
  ],
  template: `
    <button hlmBtn (click)="applyChanges()">
      <ng-icon hlm size="sm" class="mr-2" name="lucideCheck" />
      Apply Changes
    </button>
  `
})
export class ApplyChangesButtonComponent {
  @Input() conversationId!: string;
  @Input() changelogId!: string;
  constructor(private conversationService: ConversationService) { }

  applyChanges() {
    console.log('applyChanges', this.conversationId);
    this.conversationService.applyChangelog(this.conversationId, this.changelogId).subscribe(data => {
      console.log(data);
    });
  }
} 