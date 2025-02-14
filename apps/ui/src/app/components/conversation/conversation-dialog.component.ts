import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MessageBlock } from '@gongsho/text-to-blocks';
import { DialogueData } from '@gongsho/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown, lucideUserRoundPen } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';
import { MessageBlocksComponent } from '../message-blocks/message-blocks.component';

@Component({
  selector: 'app-conversation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    HlmIconDirective,
    HlmSwitchComponent,
    HlmLabelDirective,
    MessageBlocksComponent
  ],
  providers: [provideIcons({ lucideUserRoundPen, lucideBot, lucideChevronDown })],
  template: `
    <div [ngClass]="{
      'bg-gray-50 dark:bg-transparent': dialog.role === 'user',
      'bg-blue-50 dark:bg-gray-900': dialog.role === 'assistant'
    }" class="p-4 my-2 rounded-lg">
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
          <div class="flex justify-between items-center mb-1">
            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {{ dialog.role }}
            </p>
            @if (dialog.role === 'assistant') {
              <label class="flex items-center scale-[.6] cursor-pointer border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 rounded-md p-1" hlmLabel for="show-raw" (click)="toggleRaw()">
                <hlm-switch style="pointer-events:none" id="show-raw" class="mr-2" [checked]="showRaw()" />
                Raw
              </label>
            }
          </div>
          @if (dialog.role === 'assistant' && !showRaw()) {
            <app-message-blocks [blocks]="blocks"></app-message-blocks>
          } @else {
            <div class="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
              {{ dialog.content }}
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ConversationDialogComponent {
  @Input() dialog!: DialogueData;
  @Input() blocks: MessageBlock[] = [];
  showRaw = signal(false);

  toggleRaw() {
    this.showRaw.update(raw => !raw);
  }

}