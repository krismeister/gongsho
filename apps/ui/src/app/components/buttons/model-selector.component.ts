import { Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
  selector: 'app-model-selector',
  imports: [BrnSelectImports, HlmSelectImports],
  template: `
    <brn-select 
      class="inline-block" 
      (change)="onModelChange($event)"
      (ngModelChange)="onModelChange($event)"
      [placeholder]="selectedModel">
      <hlm-select-trigger class="w-56">
        <hlm-select-value
          (change)="onModelChange($event)"
        />
      </hlm-select-trigger>
      <hlm-select-content>
        <hlm-option value="claude-3-5-sonnet-20241022">Claude 3 Sonnet</hlm-option>
        <hlm-option value="claude-3-opus-20240229">Claude 3 Opus</hlm-option>
      </hlm-select-content>
    </brn-select>
  `
})
export class ModelSelectorComponent {
  selectedModel = 'claude-3-5-sonnet-20241022';
  onModelChange(event: Event) {
    const model = (event.target as HTMLSelectElement).value;
    console.log('model', model);
  }
} 