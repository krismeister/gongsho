import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DialogRoles, DialogueData } from '@gongsho/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import {
  HlmAccordionContentComponent,
  HlmAccordionDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
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
    NgIcon,
  ],
  providers: [
    provideIcons({ lucideChevronDown })
  ],
  template: `
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
      <div class="space-y-4">
        @for (dialog of stream$ | async; track trackByDialog(0, dialog)) {
          @if (isArray(dialog)) {
            <div hlmAccordion type="single" class="w-full">
              @for (item of dialog; track trackByDialog(0, item)) {

                <div hlmAccordionItem>
                  <button hlmAccordionTrigger>
                    {{ getAccordianTitle(item) }}
                    <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
                  </button>
                  <hlm-accordion-content>
                      <app-conversation-dialog [dialog]="item" />
                  </hlm-accordion-content>
                </div>
              }
            </div>
          } @else {
            <app-conversation-dialog [dialog]="dialog" />
          }
        }
      </div>
    }
  `
})
export class ConversationDialogListComponent implements OnInit {
  @Input() conversationId!: string;
  stream$!: Observable<Array<DialogueData | DialogueData[]>>;
  dialogueData: Array<DialogueData | DialogueData[]> = [];
  loading = false;
  error: string | null = null;


  constructor(private conversationService: ConversationService) {
  }

  ngOnInit(): void {
    this.stream$ = this.conversationService.getDialogStream(this.conversationId).pipe(
      scan((acc: Array<DialogueData | DialogueData[]>, current: DialogueData) => {
        if (current.dialogueRole === DialogRoles.SYSTEM || current.dialogueRole === DialogRoles.INTERSTITIAL) {
          // If last item is an array, add to it
          if (acc.length > 0 && Array.isArray(acc[acc.length - 1])) {
            (acc[acc.length - 1] as DialogueData[]).push(current);
          } else {
            // Start a new array for system/interstitial messages
            acc.push([current]);
          }
        } else {
          // For other roles, add them as single items
          acc.push(current);
        }
        return acc;
      }, [] as Array<DialogueData | DialogueData[]>),
    );
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

  trackByDialog(_: number, dialog: DialogueData | DialogueData[]): string {
    if (Array.isArray(dialog)) {
      // For arrays, concatenate all dialogue IDs
      return dialog.map(d => d.id).join('_');
    }
    return dialog.id;
  }
}