import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import {
  HlmAlertDescriptionDirective, HlmAlertDirective, HlmAlertIconDirective, HlmAlertTitleDirective
} from '@spartan-ng/ui-alert-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-error-card',
  standalone: true,
  imports: [
    NgIcon,
    HlmIconDirective,
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmIconDirective,
  ],
  providers: [provideIcons({ lucideCircleAlert })],
  template: `
    <div hlmAlert variant="destructive2">
    	<ng-icon hlm hlmAlertIcon name="lucideCircleAlert" />
      <h4 hlmAlertTitle>{{ title }}</h4>
      <p hlmAlertDesc>{{ description }}</p>
    </div>
  `
})
export class ErrorCardComponent {
  @Input() title = 'Error';
  @Input() description = 'An unexpected error occurred. Please try again.';
}