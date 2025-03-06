import { Component, computed } from "@angular/core";
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { UserPreferenceService } from "../../services/user-preference.service";

@Component({
  selector: 'app-sonner-output',
  standalone: true,
  imports: [HlmToasterComponent],
  template: `
    <hlm-toaster richColors [theme]="theme()" />
  `,
})
export class SonnerOutputComponent {
  protected readonly theme = computed(() =>
    this.preferences.isDark() ? 'dark' : 'light'
  );

  constructor(private preferences: UserPreferenceService) { }
}
