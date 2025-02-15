import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BlockTypes, MessageBlock, parseTextToBlocks } from '@gongsho/text-to-blocks';
import { AgentMessageRoles, DialogRoles, DialogueData } from '@gongsho/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideListX } from '@ng-icons/lucide';
import {
  HlmAccordionContentComponent,
  HlmAccordionDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, scan, tap } from 'rxjs/operators';
import { ErrorCardComponent } from '../../components/cards/error-card.component';
import { ConversationService } from '../../services/conversation.service';
import { ApplyChangesButtonComponent } from '../buttons/apply-changes-button.component';
import { GenerateChangelogButtonComponent } from '../buttons/generate-changelog-button.component';
import { ConversationDialogComponent } from './conversation-dialog.component';

type DialogueDataWithMessageblocks = DialogueData & { blocks: MessageBlock[] }

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
    HlmIconDirective,
    HlmSpinnerComponent,
    GenerateChangelogButtonComponent,
    ApplyChangesButtonComponent,
    ErrorCardComponent
  ],
  providers: [
    provideIcons({ lucideChevronDown, lucideListX })
  ],
  template: `
    <div class="space-y-4">
      @for (dialog of groupedStream$ | async; track trackByDialog(0, dialog)) {
        @if (isArray(dialog)) {
          <div hlmAccordion type="single" class="w-full">
            @for (item of dialog; track trackByDialog(0, item)) {

              <div hlmAccordionItem>
                <button hlmAccordionTrigger>
                  {{ getAccordianTitle(item) }}
                  <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
                </button>
                <hlm-accordion-content>
                    <app-conversation-dialog [dialog]="item" [blocks]="item.blocks" />
                </hlm-accordion-content>
              </div>
            }
          </div>
        } @else {
          <app-conversation-dialog [dialog]="dialog" [blocks]="dialog.blocks" />
        }
      }
    </div>


    @if (waitingOnAssistant$ | async) {
      <div class="py-4 flex justify-center">
        <hlm-spinner />
      </div>
    }
    
    @if (lastDialogHasChanges$ | async) {
      <div class="py-4 flex justify-center">
        <app-generate-changelog-button [conversationId]="conversationId" />
      </div>
    }

    <ng-container *ngIf="lastDialogIsChangelog$ | async as changelog">
      @if (changelog.isChangelog) {
        <div class="py-4 flex justify-center">
          <app-apply-changes-button 
            [conversationId]="conversationId"
            [changelogId]="changelog.changelogId"
          />
        </div>
      }
    </ng-container>

    @if (error) {
      <app-error-card title="404 Error" description="Could not find the conversation." />
    }

  `
})
export class ConversationDialogListComponent implements OnInit, OnDestroy {
  @Input() conversationId!: string;
  private SSESubscription?: Subscription;
  stream$: Subject<DialogueData> = new Subject()
  streamWithBlocks$!: Observable<DialogueDataWithMessageblocks>;
  groupedStream$!: Observable<Array<DialogueDataWithMessageblocks | DialogueDataWithMessageblocks[]>>;
  dialogueData: Array<DialogueDataWithMessageblocks | DialogueDataWithMessageblocks[]> = [];
  waitingOnAssistant$!: Observable<boolean>;
  lastDialogHasChanges$!: Observable<boolean>
  lastDialogIsChangelog$!: Observable<{ changelogId: string, isChangelog: boolean }>
  error = false;

  constructor(private conversationService: ConversationService) {
  }

  ngOnInit(): void {
    // some strange bug, we need to store the stream in a subject to avoid it not being updated
    // TODO: fix the SSE stream to not have this problem
    this.SSESubscription = this.conversationService.getDialogStream(this.conversationId).subscribe({
      next: (data) => {
        this.stream$.next(data)
      },
      error: (error) => {
        console.error('Error in conversation stream:', error);
        this.error = true;
      }
    })

    this.streamWithBlocks$ = this.stream$.pipe(
      map((dialogueData) => {
        return { ...dialogueData, blocks: parseTextToBlocks(dialogueData.content) }
      }),
    )

    this.groupedStream$ = this.streamWithBlocks$.pipe(
      scan((acc: Array<DialogueDataWithMessageblocks | DialogueDataWithMessageblocks[]>, current: DialogueDataWithMessageblocks) => {
        if (current.dialogueRole === DialogRoles.SYSTEM || current.dialogueRole === DialogRoles.INTERSTITIAL || current.dialogueRole === DialogRoles.CHANGELOG) {
          // If last item is an array, add to it
          if (acc.length > 0 && Array.isArray(acc[acc.length - 1])) {
            (acc[acc.length - 1] as DialogueDataWithMessageblocks[]).push(current);
          } else {
            // Start a new array for system/interstitial messages
            acc.push([current]);
          }
        } else {
          // For other roles, add them as single items
          acc.push(current);
        }
        return acc;
      }, [] as Array<DialogueDataWithMessageblocks | DialogueDataWithMessageblocks[]>),
    );

    this.lastDialogHasChanges$ = this.streamWithBlocks$.pipe(
      map((dialogueData) => {
        return (
          dialogueData.blocks.some(block => block.type === BlockTypes.REPLACE) &&
          dialogueData.dialogueRole !== DialogRoles.CHANGELOG
        )
      })
    );

    this.lastDialogIsChangelog$ = this.stream$.pipe(
      map((dialogueData) => {
        return {
          changelogId: dialogueData.id,
          isChangelog: dialogueData.dialogueRole === DialogRoles.CHANGELOG
        }
      }),
    );

    this.waitingOnAssistant$ = this.streamWithBlocks$.pipe(
      tap((data) => console.log('waiting on assistant', data)),
      map((dialogueData) => {
        return dialogueData.role === AgentMessageRoles.USER || dialogueData.role === AgentMessageRoles.NONE
      }),
      distinctUntilChanged(),
      tap((data) => console.log('waiting on assistant 2', data)),
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

  ngOnDestroy(): void {
    this.SSESubscription?.unsubscribe();
  }
}