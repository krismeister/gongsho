import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BlockTypes, MessageBlock, parseTextToBlocks } from '@gongsho/text-to-blocks';
import { AgentMessageRoles, DialogData, DialogRoles } from '@gongsho/types';
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
import { TokenCost, TokenCostPipe } from '../../pipes/token-cost.pipe';
import { ConversationService } from '../../services/conversation.service';
import { ApplyChangesButtonComponent } from '../buttons/apply-changes-button.component';
import { GenerateChangelogButtonComponent } from '../buttons/generate-changelog-button.component';
import { TokenCostEstimateComponent } from '../cost/token-cost-estimate.component';
import { ConversationDialogComponent } from './conversation-dialog.component';

type DialogWithBlocks = DialogData & { blocks: MessageBlock[] }

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
    ErrorCardComponent,
    TokenCostEstimateComponent
  ],
  providers: [
    TokenCostPipe,
    provideIcons({ lucideChevronDown, lucideListX })
  ],
  template: `
    <div class="relative">
      <div class="space-y-4">
        @for (dialog of groupedStream$ | async; track trackByDialog(0, dialog)) {
          @if (isArray(dialog)) {
            <div hlmAccordion type="single" class="w-full">
              @for (item of dialog; track trackByDialog(0, item)) {

                <div hlmAccordionItem>
                  <button hlmAccordionTrigger>
                    {{ getAccordionTitle(item) }}
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

      <ng-container *ngIf="lastDialogIsChangelist$ | async as changelist">
        @if (changelist.isChangelist) {
          <div class="py-4 flex justify-center">
            <app-apply-changes-button 
              [conversationId]="conversationId"
              [changelistId]="changelist.changelistId"
            />
          </div>
        }
      </ng-container>

      @if (error) {
        <app-error-card title="404 Error" description="Could not find the conversation." />
      }


      <div class="absolute bottom-4 right-0">
        <app-token-cost-estimate message="est cost: " [tokenCost]="(totalCost$ | async) ?? { inputTokens: 0, outputTokens: 0, inputCost: 0, outputCost: 0 }" />
      </div>

    </div>
   
  `
})
export class ConversationDialogListComponent implements OnInit, OnDestroy {
  private tokenCostPipe = inject(TokenCostPipe);
  @Input() conversationId!: string;
  private SSESubscription?: Subscription;
  stream$: Subject<DialogData> = new Subject()
  streamWithBlocks$!: Observable<DialogWithBlocks>;
  groupedStream$!: Observable<Array<DialogWithBlocks | DialogWithBlocks[]>>;
  dialogData: Array<DialogWithBlocks | DialogWithBlocks[]> = [];
  waitingOnAssistant$!: Observable<boolean>;
  lastDialogHasChanges$!: Observable<boolean>
  lastDialogIsChangelist$!: Observable<{ changelistId: string, isChangelist: boolean }>
  totalCost$!: Observable<TokenCost>;

  error = false;

  constructor(
    private conversationService: ConversationService,
  ) {
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
      map((dialogData) => {
        return { ...dialogData, blocks: parseTextToBlocks(dialogData.content) }
      }),
    )

    this.groupedStream$ = this.streamWithBlocks$.pipe(
      scan((acc: Array<DialogWithBlocks | DialogWithBlocks[]>, current: DialogWithBlocks) => {
        if (current.dialogRole === DialogRoles.SYSTEM ||
          current.dialogRole === DialogRoles.INTERSTITIAL || current.dialogRole === DialogRoles.CHANGELIST) {
          // If last item is an array, add to it
          if (acc.length > 0 && Array.isArray(acc[acc.length - 1])) {
            (acc[acc.length - 1] as DialogWithBlocks[]).push(current);
          } else {
            // Start a new array for system/interstitial messages
            acc.push([current]);
          }
        } else {
          // For other roles, add them as single items
          acc.push(current);
        }
        return acc;
      }, [] as Array<DialogWithBlocks | DialogWithBlocks[]>),
    );

    this.lastDialogHasChanges$ = this.streamWithBlocks$.pipe(
      map((dialogData) => {
        return (
          dialogData.blocks.some(block => block.type === BlockTypes.REPLACE) &&
          dialogData.dialogRole !== DialogRoles.CHANGELIST
        )
      })
    );

    this.lastDialogIsChangelist$ = this.stream$.pipe(
      map((dialogData) => {
        return {
          changelistId: dialogData.id,
          isChangelist: dialogData.dialogRole === DialogRoles.CHANGELIST
        }
      }),
    );

    this.waitingOnAssistant$ = this.streamWithBlocks$.pipe(
      tap((data) => console.log('waiting on assistant', data.role, data.role !== AgentMessageRoles.ASSISTANT)),
      map((dialogData) => {
        return dialogData.role === AgentMessageRoles.USER
      }),
      distinctUntilChanged(),
      tap((data) => console.log('waiting on assistant 2', data)),
    );

    this.totalCost$ = this.streamWithBlocks$.pipe(
      scan((acc: TokenCost, dialogData: DialogWithBlocks) => {
        const cost = this.tokenCostPipe.transform(dialogData);
        return {
          inputTokens: acc.inputTokens + cost.inputTokens,
          outputTokens: acc.outputTokens + cost.outputTokens,
          inputCost: acc.inputCost + cost.inputCost,
          outputCost: acc.outputCost + cost.outputCost,
        };
      }, { inputTokens: 0, outputTokens: 0, inputCost: 0, outputCost: 0 })
    );
  }

  isArray(value: DialogData | DialogData[]): value is DialogData[] {
    return Array.isArray(value);
  }

  getAccordionTitle(dialog: DialogData): string {
    let out = '';
    if (dialog.dialogRole === DialogRoles.SYSTEM) {
      out += 'System Message: ';
    } else if (dialog.dialogRole === DialogRoles.INTERSTITIAL) {
      out += 'Interstitial Message: ';
    }
    return out + dialog.description;
  }

  trackByDialog(_: number, dialog: DialogData | DialogData[]): string {
    if (Array.isArray(dialog)) {
      // For arrays, concatenate all IDs
      return dialog.map(d => d.id).join('_');
    }
    return dialog.id;
  }

  ngOnDestroy(): void {
    this.SSESubscription?.unsubscribe();
  }
}