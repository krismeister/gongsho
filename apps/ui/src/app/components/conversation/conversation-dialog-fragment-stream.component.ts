import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { BlockTypes, MessageBlock, parseStreamingBlocks, parseTextToBlocks } from '@gongsho/text-to-blocks';
import { DialogData, DialogFragment, DialogRoles } from '@gongsho/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { Observable, scan, share, Subscription } from 'rxjs';
import { ConversationService } from '../../services/conversation.service';
import { MessageBlocksComponent } from '../message-blocks/message-blocks.component';
import { AssistantDialogInfoComponent } from './assistant-dialog-info.component';
import { ConversationDialogComponent } from './conversation-dialog.component';
import { CONVERSATION_DIALOG_STYLES } from './styles/conversation-dialog.styles';
@Component({
  selector: 'app-conversation-dialog-fragment-stream',
  standalone: true,
  imports: [CommonModule, NgIcon, HlmIconDirective, ConversationDialogComponent, MessageBlocksComponent, AssistantDialogInfoComponent],
  providers: [provideIcons({ lucideBot })],
  template: `
    @if (completeDialog) {
      <app-conversation-dialog [dialog]="completeDialog" [blocks]="blocks" />
    } @else {
    <div [ngClass]="[
      CONVERSATION_DIALOG_STYLES.container[dialog.role],
      'p-4 my-2 rounded-lg'
    ]">
    <div class="flex items-start relative">
      @if (dialogForInfo) {
      <app-assistant-dialog-info 
            [dialog]="dialogForInfo" 
            [showRawValue]="showRaw()" 
            (toggleRaw)="showRaw.set($event)" 
          />
        }
        <div [ngClass]="[
          CONVERSATION_DIALOG_STYLES.icon.wrapper[dialog.role],
          CONVERSATION_DIALOG_STYLES.icon.base
        ]">
          <ng-icon [ngClass]="CONVERSATION_DIALOG_STYLES.icon.icon[dialog.role]" hlm name="lucideBot" />
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {{ dialog.role }}
            </p>
          </div>
          <div class="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            @if (showRaw()) {
              {{ dialogForInfo?.content }}
            } @else {
              @if (blocksStream$ | async; as streamBlocks) {
                @if (streamBlocks.length > 0) {
                  <app-message-blocks [blocks]="streamBlocks"></app-message-blocks>
                } @else {
                  <app-message-blocks [blocks]="blocks"></app-message-blocks>
                }
              }
              {{ partialText }}
            }
          </div>
        </div>
      </div>
    </div>
    }
  `
})
export class ConversationDialogFragmentStreamComponent implements OnInit, OnDestroy {
  @Input() conversationId!: string;
  @Input() dialog!: DialogData;

  partialText = ''
  content = '';
  completeDialog?: DialogData
  blocks: MessageBlock[] = [];
  blocksStream$!: Observable<MessageBlock[]>;
  dialogForInfo?: DialogData
  showRaw = signal(false);

  private subscription?: Subscription;
  protected readonly CONVERSATION_DIALOG_STYLES = CONVERSATION_DIALOG_STYLES;

  constructor(private conversationService: ConversationService) {
  }

  ngOnInit() {
    if (this.conversationId && this.dialog.id) {
      const sharedStream = this.conversationService
        .getFragmentStream(this.conversationId, this.dialog.id)
        .pipe(share());

      this.blocksStream$ = sharedStream.pipe(
        parseStreamingBlocks(),
        scan((acc: MessageBlock[], fragment) => {

          if (fragment.currentBlock?.type === BlockTypes.TEXT) {
            this.partialText = fragment.currentBlock.partial;
          } else {
            this.partialText = '';
          }

          if (fragment.blocks.length > 0) {
            const lastBlock = acc[acc.length - 1];
            const nextBlock = fragment.blocks[0];
            if (lastBlock?.type === BlockTypes.TEXT && nextBlock?.type === BlockTypes.TEXT
              && lastBlock.content === nextBlock.content) {
              return acc;
            }
            return [...acc, ...fragment.blocks]
          }
          return acc
        }, [])
      );

      this.subscription = sharedStream.subscribe({
        next: (fragment: DialogFragment | DialogData) => {
          if (fragment.dialogRole === DialogRoles.ASSISTANT_FRAGMENT) {
            this.content += fragment.content;
          } else {
            this.completeDialog = fragment as DialogData;
            this.blocks = parseTextToBlocks(this.completeDialog.content);
            this.subscription?.unsubscribe();
          }
        },
        error: (error) => {
          console.error('Error in fragment stream:', error);
        },
        complete: () => {
          this.content = this.content.trim();
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
} 