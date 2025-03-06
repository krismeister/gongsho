import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgentModelConfigs, defaultAgentModel, PreferredAgentModels } from '@gongsho/types';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { UserPreferenceService } from '../../services/user-preference.service';

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
  selectedModel: PreferredAgentModels = defaultAgentModel;
  @Output() selectedModelChange = new EventEmitter<PreferredAgentModels>();
  options = Object.values(AgentModelConfigs)
    .filter(model => !model.deprecated)
    .map(model => ({
      label: model.friendlyName,
      value: model.model,
    }));

  constructor(private userPreferenceService: UserPreferenceService) {
    this.selectedModel = this.userPreferenceService.getSelectedModel();
  }

  onModelChange(event: string) {
    this.userPreferenceService.setSelectedModel(event as PreferredAgentModels);
    console.log('event', event);
    this.selectedModelChange.emit(event as PreferredAgentModels);
  }
}