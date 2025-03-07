import { CommonModule } from '@angular/common';

import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { BrnHoverCardModule } from '@spartan-ng/brain/hover-card';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmHoverCardModule } from '@spartan-ng/ui-hovercard-helm';
import { TokenCost } from '../../pipes/token-cost.pipe';

@Component({
  selector: 'app-token-cost-estimate',
  standalone: true,
  imports: [CommonModule, HlmBadgeDirective, BrnHoverCardModule, HlmHoverCardModule, NgIcon],
  providers: [provideIcons({ lucideInfo })],
  template: `
  @if (tokenCost) {
    <brn-hover-card>
      @if (showAsIcon) {
        <ng-icon name="lucideInfo" class="text-muted-foreground" brnHoverCardTrigger />
      } @else {
        <div hlmBadge variant="outline" class="text-muted-foreground" brnHoverCardTrigger>
          {{ formatCost(tokenCost.inputCost + tokenCost.outputCost) }}
        </div>
      }
      <hlm-hover-card-content *brnHoverCardContent class="w-64">
        <div class="space-y-2">
          <h4 class="text-sm font-semibold">Estimated Cost</h4>
          <div class="text-sm space-y-1">
            <p>Input: {{ tokenCost.inputTokens }} tokens ({{ formatDetailedCost(tokenCost.inputCost) }})</p>
            <p>Output: {{ tokenCost.outputTokens }} tokens ({{ formatDetailedCost(tokenCost.outputCost) }})</p>
            <p class="text-xs text-muted-foreground" > based on public pricing </p>
            @if (requestId) {
              <p class="text-sm pt-1">Request ID:</p>
              <p class="text-muted-foreground">{{ requestId }}</p>
            }
          </div>
        </div>
      </hlm-hover-card-content>
    </brn-hover-card>
  }
  `,
})
export class TokenCostEstimateComponent {
  @Input() tokenCost!: TokenCost;
  @Input() message = '';
  @Input() showAsIcon = false;
  @Input() requestId = '';

  public formatCost(cost: number): string {
    if (cost === 0) {
      return '$0';
    }
    if (cost < 0.01) {
      return '< $0.01';
    }
    return `$${cost.toFixed(2)} `;
  }

  public formatDetailedCost(cost: number): string {
    return `$${cost.toFixed(4)} `;
  }

}