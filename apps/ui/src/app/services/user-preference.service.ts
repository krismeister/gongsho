import { Injectable, signal } from '@angular/core';
import { defaultAgentModel, PreferredAgentModels } from '@gongsho/types';
import { HighlightLoader } from 'ngx-highlightjs';

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {
  private readonly lightThemeCss = '/highlight-css/github.min.css';
  private readonly darkThemeCss = '/highlight-css/felipec.min.css';

  isDark = signal(true);

  constructor(private hljsLoader: HighlightLoader) {
    this.initializeTheme();
  }

  private initializeTheme() {
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDark.set(savedTheme !== 'light');
        this.hljsLoader.setTheme(savedTheme === 'light' ? this.lightThemeCss : this.darkThemeCss);
      } else {
        // Default to dark
        this.isDark.set(true);
        this.hljsLoader.setTheme(this.darkThemeCss);
      }

      // Apply the theme
      document.documentElement.classList.toggle('dark', this.isDark());
    }
  }

  toggleTheme() {
    this.isDark.update(dark => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', !dark ? 'dark' : 'light');
      this.hljsLoader.setTheme(!dark ? this.darkThemeCss : this.lightThemeCss);
      return !dark;
    });
  }

  getSelectedModel(): PreferredAgentModels {
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel && Object.values(PreferredAgentModels).includes(savedModel as PreferredAgentModels)) {
      return savedModel as PreferredAgentModels;
    }
    return defaultAgentModel;
  }

  setSelectedModel(model: PreferredAgentModels): void {
    if (Object.values(PreferredAgentModels).includes(model)) {
      localStorage.setItem('selectedModel', model);
    } else {
      console.error(`Invalid model: ${model}, maybe a depreciated model?`);
    }
  }
} 