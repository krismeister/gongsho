import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

@Component({
  standalone: true,
  imports: [RouterModule, MainMenuComponent],
  selector: 'app-root',
  template: `
    <div class="min-h-screen flex flex-col">
      <div class="gradient-top"></div>
      <div class="main min-h-screen flex flex-col">
        <app-main-menu></app-main-menu>
        <main class="flex-1 p-4 flex flex-col justify-end">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppComponent { }
