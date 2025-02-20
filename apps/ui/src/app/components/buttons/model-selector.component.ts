import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgentModelConfigs, AgentModels, defaultAgentModel } from '@gongsho/types';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
  selector: 'app-model-selector',
  standalone: true,
  imports: [BrnSelectImports, HlmSelectImports, FormsModule],
  template: `
    <brn-select 
      class="inline-block"
      [(ngModel)]="selectedModel"
      (ngModelChange)="onModelChange($event)"
       >
      <hlm-select-trigger class="w-56">
        <hlm-select-value  />
      </hlm-select-trigger>
      <hlm-select-content >
        @for (option of options; track option.value) {
          <hlm-option [value]="option.value">{{ option.label }}</hlm-option>
        }
      </hlm-select-content>
    </brn-select>
  `
})
export class ModelSelectorComponent {
  selectedModel = defaultAgentModel;
  @Output() selectedModelChange = new EventEmitter<AgentModels>();
  options = Object.values(AgentModelConfigs).map(model => ({
    label: model.friendlyName,
    value: model.model,
  }));

  constructor() {
    // Load saved model from localStorage or use default
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel && Object.values(AgentModels).includes(savedModel as AgentModels)) {
      this.selectedModel = savedModel as AgentModels;
    } else {
      this.selectedModel = defaultAgentModel;
    }
  }

  onModelChange(event: string) {
    localStorage.setItem('selectedModel', event);
    console.log('event', event);
    this.selectedModelChange.emit(event as AgentModels);
  }
} 