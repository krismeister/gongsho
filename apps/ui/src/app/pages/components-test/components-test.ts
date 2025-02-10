import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown, lucideHouse, lucideUserRoundPen } from '@ng-icons/lucide';
import {
	HlmAccordionContentComponent,
	HlmAccordionDirective,
	HlmAccordionIconDirective,
	HlmAccordionItemDirective,
	HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'app-components-test',
	standalone: true,
	imports: [
		HlmButtonDirective,
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionContentComponent,
		HlmAccordionIconDirective,
		NgIcon,
		HlmIconDirective,
		HlmBadgeDirective,
	],
	providers: [provideIcons({ lucideHouse, lucideUserRoundPen, lucideBot, lucideChevronDown })],
	template: `
			<p class="text-xs">This is a test here</p>
			<br />
	    <a target="_blank" href="https://github.com/goetzrobin/spartan" hlmBadge>This is madness. This is spartan.</a>
			<br />
				<br />
				<ng-icon hlm name="lucideHouse" [size]="'xl'" />
				<h1>pen</h1>
				<ng-icon hlm name="lucideUserRoundPen" />
				<h1>bot</h1>
				<ng-icon hlm name="lucideBot" />
	      <hlm-icon hlmAccIcon />
		  <h1>Gongsho</h1>
		  <hr />
		<div hlmAccordion type="multiple" class="pb-4">
			<div hlmAccordionItem isOpened>
				<button hlmAccordionTrigger>
					Is it accessible?
					 <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it styled?
					 <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It comes with default styles that match the other components' aesthetics.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem [isOpened]="_thirdOpened()">
				<button hlmAccordionTrigger>
					Is it animated?
					<hlm-icon hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It's animated by default, but you can disable it if you prefer.
				</hlm-accordion-content>
			</div>
		</div>
		<button hlmBtn (click)="toggleThird()">Toggle Third Item</button>
	`,
})
export class ComponentsTestComponent {
	protected readonly _thirdOpened = signal(false);
	toggleThird() {
		this._thirdOpened.set(!this._thirdOpened());
	}
}