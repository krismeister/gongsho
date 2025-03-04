import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogData } from '@gongsho/types';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';
import { TokenCostPipe } from '../../pipes/token-cost.pipe';
import { TokenCostEstimateComponent } from '../cost/token-cost-estimate.component';

@Component({
  selector: 'app-assistant-dialog-info',
  standalone: true,
  imports: [
    CommonModule,
    HlmSwitchComponent,
    HlmLabelDirective,
    TokenCostEstimateComponent,
    TokenCostPipe
  ],
  template: `
    <div class="absolute right-0 -top-3 flex items-center gap-2">
      <!-- eslint-disable-next-line -->
      <label class="flex items-center scale-[.6] cursor-pointer border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 rounded-md p-1" hlmLabel
        for="show-raw-{{ dialog.id }}"
        (click)="toggleRaw.emit(!showRawValue)">
        <hlm-switch style="pointer-events:none" id="show-raw-{{ dialog.id }}" class="mr-2" [checked]="showRawValue" />
        Raw
      </label>
      <app-token-cost-estimate [tokenCost]="dialog | tokenCost" [showAsIcon]="true" [requestId]="dialog.requestId ?? 'n/a'" />
    </div>
  `
})
export class AssistantDialogInfoComponent {
  @Input() dialog!: DialogData;
  @Input() showRawValue = false;
  @Output() toggleRaw = new EventEmitter<boolean>();
} 