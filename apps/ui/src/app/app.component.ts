import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SonnerOutputComponent } from './components/notifications/sonner-output.component';
@Component({
  standalone: true,
  imports: [RouterModule, MainMenuComponent, SonnerOutputComponent],
  selector: 'app-root',
  template: `
    <div class="root-div min-h-screen flex flex-col">
      <div class="gradient-top"></div>
      <div class="main min-h-screen flex flex-col">
        <app-main-menu></app-main-menu>
        <main class="flex-1 p-4 flex flex-col justify-end">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-sonner-output></app-sonner-output>
    </div>
  `
})
export class AppComponent { }
