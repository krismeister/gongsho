import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogueData } from '@gongsho/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown, lucideUserRoundPen } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';


@Component({
  selector: 'app-conversation-dialog',
  standalone: true,
  imports: [CommonModule, NgIcon, HlmIconDirective,],
  providers: [provideIcons({ lucideUserRoundPen, lucideBot, lucideChevronDown })],
  template: `
    <div class="p-4 my-2 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div class="flex items-start">
        @if (dialog.role === 'assistant') {
          <div class="p-2 mr-3 rounded-full bg-purple-100 dark:bg-purple-900 w-10 h-10">
            <ng-icon class="text-purple-600 dark:text-purple-300 p-0 m-0" hlm name="lucideBot" />
          </div>
        } @else {
          <div class="p-2 mr-3 rounded-full bg-gray-200 dark:bg-gray-700 w-10 h-10">
            <ng-icon class="w-5 h-5 text-blue-600 dark:text-blue-300" hlm name="lucideUserRoundPen" />
          </div>
        }
        <div class="flex-1">
          <p class="mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
            {{ dialog.role }}
          </p>
          <div class="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {{ dialog.content }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConversationDialogComponent {
  @Input() dialog!: DialogueData;
}