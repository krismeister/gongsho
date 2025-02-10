import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DialogRoles, DialogueData } from '@gongsho/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import {
  HlmAccordionContentComponent,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { map } from 'rxjs/operators';
import { ConversationService } from '../../services/conversation.service';
import { ConversationDialogComponent } from './conversation-dialog.component';

@Component({
  selector: 'app-conversation-dialog-list',
  standalone: true,
  imports: [
    CommonModule,
    ConversationDialogComponent,
    HlmAccordionDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    HlmAccordionContentComponent,
    HlmAccordionIconDirective,
    NgIcon,
  ],
  providers: [
    provideIcons({ lucideChevronDown })
  ],
  template: `
    <div class="container mx-auto max-w-4xl px-4">
      @if (loading) {
        <div class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      }

      @if (error) {
        <div class="bg-red-50 dark:bg-red-900 p-4 rounded-lg my-4">
          <p class="text-red-600 dark:text-red-200">
            Error loading conversation: {{ error }}
          </p>
        </div>
      }

      @if (!loading && !error) {
        @if (dialogueData.length > 0) {
          <div class="space-y-4">
            @for (dialog of dialogueData; track dialog) {
              @if (isArray(dialog)) {
                <div hlmAccordion type="single" class="w-full">
                  <div *ngFor="let item of dialog">

                    <div hlmAccordionItem>
                      <button hlmAccordionTrigger>
                        {{ getAccordianTitle(item) }}
                        <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
                      </button>
                      <hlm-accordion-content>
                          <app-conversation-dialog [dialog]="item" />
                      </hlm-accordion-content>
                    </div>

                  </div>
                </div>
              } @else {
                <app-conversation-dialog [dialog]="dialog" />
              }
            }
          </div>
        } @else {
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            No messages in this conversation
          </div>
        }
      }
    </div>
  `
})
export class ConversationDialogListComponent implements OnInit {
  @Input() conversationId!: string;
  dialogueData: Array<DialogueData | DialogueData[]> = [];
  loading = false;
  error: string | null = null;

  // TODO add trackby for dialogueData

  constructor(private conversationService: ConversationService) { }

  ngOnInit() {
    this.loadConversation();
  }

  isArray(value: DialogueData | DialogueData[]): value is DialogueData[] {
    return Array.isArray(value);
  }

  getAccordianTitle(dialog: DialogueData): string {
    let out = '';
    if (dialog.dialogueRole === DialogRoles.SYSTEM) {
      out += 'System Message: ';
    } else if (dialog.dialogueRole === DialogRoles.INTERSTITIAL) {
      out += 'Interstitial Message: ';
    }
    return out + dialog.description;
  }

  loadConversation() {
    this.loading = true;
    this.error = null;

    this.conversationService.getConversation(this.conversationId)
      .pipe(
        map(conversation => {
          const dialogueData = conversation.details.dialogueData;
          const out: Array<DialogueData | DialogueData[]> = [];

          for (let i = 0; i < dialogueData.length; i++) {
            const current = dialogueData[i];

            if (current.dialogueRole === DialogRoles.SYSTEM || current.dialogueRole === DialogRoles.INTERSTITIAL) {
              // If previous item in out is an array, add to it
              if (out.length > 0 && Array.isArray(out[out.length - 1])) {
                (out[out.length - 1] as DialogueData[]).push(current);
              } else {
                // Start a new array for system/interstitial messages
                out.push([current]);
              }
            } else {
              // For other roles, add them as single items
              out.push(current);
            }
          }

          return out;
        })
      )
      .subscribe({
        next: (processedDialogueData) => {
          this.dialogueData = processedDialogueData;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading conversation:', error);
          this.error = error instanceof Error ? error.message : 'An unknown error occurred';
          this.loading = false;
        }
      });
  }
}