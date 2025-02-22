import { Pipe, PipeTransform } from '@angular/core';
import { AgentModelConfigs, DialogData } from '@gongsho/types';

export type TokenCost = {
  inputCost: number;
  outputCost: number;
  inputTokens: number;
  outputTokens: number;
}

@Pipe({
  name: 'tokenCost',
  standalone: true
})
export class TokenCostPipe implements PipeTransform {
  transform(dialog: DialogData): TokenCost {
    if (!dialog.usage || !dialog.agent) {
      return {
        inputCost: 0,
        outputCost: 0,
        inputTokens: 0,
        outputTokens: 0
      };
    }
    return {
      inputCost: ((dialog.usage.input_tokens || 0) * AgentModelConfigs[dialog.agent].cost.inputTokensCostPerMillion) / 1_000_000,
      outputCost: ((dialog.usage.output_tokens || 0) * AgentModelConfigs[dialog.agent].cost.outputTokensCostPerMillion) / 1_000_000,
      inputTokens: dialog.usage.input_tokens || 0,
      outputTokens: dialog.usage.output_tokens || 0
    };
  }
}
