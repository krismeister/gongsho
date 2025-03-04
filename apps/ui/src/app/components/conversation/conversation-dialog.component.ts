import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MessageBlock } from '@gongsho/text-to-blocks';
import { DialogData } from '@gongsho/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown, lucideInfo, lucideUserRoundPen } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { MessageBlocksComponent } from '../message-blocks/message-blocks.component';
import { AssistantDialogInfoComponent } from './assistant-dialog-info.component';
import { CONVERSATION_DIALOG_STYLES } from './styles/conversation-dialog.styles';

@Component({
  selector: 'app-conversation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    HlmIconDirective,
    MessageBlocksComponent,
    AssistantDialogInfoComponent
  ],
  providers: [provideIcons({ lucideUserRoundPen, lucideBot, lucideChevronDown, lucideInfo })],
  template: `
    <div [ngClass]="[
      CONVERSATION_DIALOG_STYLES.container[dialog.role],
      'p-4 my-2 rounded-lg'
    ]">
      <div class="flex items-start relative">
        @if (dialog.role === 'assistant') {
          <app-assistant-dialog-info 
            [dialog]="dialog" 
            [showRawValue]="showRaw()" 
            (toggleRaw)="showRaw.set($event)" 
          />
          <div [ngClass]="[
            CONVERSATION_DIALOG_STYLES.icon.wrapper[dialog.role],
            CONVERSATION_DIALOG_STYLES.icon.base
          ]">
            <ng-icon [ngClass]="CONVERSATION_DIALOG_STYLES.icon.icon[dialog.role]" hlm name="lucideBot" />
          </div>
        } @else if (dialog.role === 'none') {
          <div [ngClass]="[
            CONVERSATION_DIALOG_STYLES.icon.wrapper[dialog.role],
            CONVERSATION_DIALOG_STYLES.icon.base
          ]">
            <ng-icon [ngClass]="CONVERSATION_DIALOG_STYLES.icon.icon[dialog.role]" hlm name="lucideInfo" />
          </div>
        } @else {
          <div [ngClass]="[
            CONVERSATION_DIALOG_STYLES.icon.wrapper[dialog.role],
            CONVERSATION_DIALOG_STYLES.icon.base
          ]">
            <ng-icon [ngClass]="CONVERSATION_DIALOG_STYLES.icon.icon[dialog.role]" hlm name="lucideUserRoundPen" />
          </div>
        }
        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">
              @if (dialog.role === 'none') {
                {{ dialog.dialogRole }}
              } @else {
                {{ dialog.role }}
              }
            </p>
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
  @Input() dialog!: DialogData;
  @Input() blocks: MessageBlock[] = [];
  showRaw = signal(false);
  protected readonly CONVERSATION_DIALOG_STYLES = CONVERSATION_DIALOG_STYLES;

  toggleRaw() {
    this.showRaw.update(raw => !raw);
  }

}