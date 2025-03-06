import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideBox, lucideChevronDown, lucideHouse, lucideUserRoundPen } from '@ng-icons/lucide';
import {
  HlmAccordionContentComponent,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmAlertDescriptionDirective, HlmAlertDirective, HlmAlertIconDirective, HlmAlertTitleDirective } from '@spartan-ng/ui-alert-helm';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';
import { toast } from 'ngx-sonner';

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
    HlmLabelDirective,
    HlmSwitchComponent,
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmIconDirective,
  ],
  providers: [provideIcons({ lucideHouse, lucideUserRoundPen, lucideBot, lucideChevronDown, lucideBox })],
  template: `
	<h1>Components Test</h1>

  <h2>alert message</h2>
  
  <div hlmAlert variant="destructive">
    <ng-icon hlm hlmAlertIcon name="lucideBox" />
    <h4 hlmAlertTitle>Introducing spartan/ui!</h4>
    <p hlmAlertDesc>
      spartan/ui is made up of unstyled UI providers, the spartan/ui/brain.<br />
      On top we add spartan/ui/helm(et) with shadcn-like styles.
    </p>
  </div>
  
  <h2>switch</h2>
  <label class="flex items-center" hlmLabel for="airplane-mode">
    <hlm-switch class="mr-2" id="airplane-mode" />
    Airplane mode
  </label>
  <p class="text-xs">This is a test here</p>
  <br />
  
  <a target="_blank" href="https://github.com/goetzrobin/spartan" hlmBadge>
    This is madness. This is spartan.
  </a>
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
      <hlm-accordion-content>
        Yes. It adheres to the WAI-ARIA design pattern.
      </hlm-accordion-content>
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

  <h2>Toasts</h2>
  <div class="flex gap-4 mb-8">
    <button hlmBtn (click)="showBottomToast()">
      Show Bottom Toast
    </button>
    <button hlmBtn (click)="showTopRightToast()">
      Show Top Right Toast
    </button>
  </div>

  `,
})
export class ComponentsTestComponent {
  protected readonly _thirdOpened = signal(false);

  showBottomToast() {
    console.log('showBottomToast');
    toast.error('Bottom notification', {
      description: 'This toast appears at the bottom',
      position: 'bottom-center',
    });
  }

  showTopRightToast() {
    console.log('showTopRightToast');
    toast.warning('Top right notification', {
      description: 'This toast appears in the top right',
      position: 'top-right',
      action: {
        label: 'Action',
        onClick: () => console.log('Action clicked'),
      }
    });
  }

  toggleThird() {
    this._thirdOpened.set(!this._thirdOpened());
  }
}