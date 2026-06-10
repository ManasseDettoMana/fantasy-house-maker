import { Component, computed, DOCUMENT, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

export type Theme = 'white' | 'dark';
@Component({
  selector: 'app-header',
  imports: [RouterLink, ButtonModule, MenuModule, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  authService = inject(AuthService);  

  // prova cambio tema
  private readonly document = inject(DOCUMENT);
  private readonly _applyTheme = effect(() => {
    const theme = this.currentTheme();
    this.document.body.classList.toggle('dark-theme', theme === 'dark');
  });



  currentTheme = signal<Theme>('white');
  isWhiteTheme = computed(() => this.currentTheme() == 'white');

  isLogged = signal<boolean>(this.authService.isLoggedIn());
  isDashboard = computed(() => this.currentUrl()?.startsWith('/dashboard'));

  private currentUrl = toSignal(
    this.router.events.pipe(map(() => this.router.url)),
    { initialValue: this.router.url }
  );

  protected readonly options = computed<MenuItem[]>(() => [
    {
      label: 'Opzioni',
      items: [
        {
          label: 'Tema',
          icon: this.isWhiteTheme() ? 'pi pi-moon' : 'pi pi-sun',
          command: () => this.changeTheme()
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        }
      ]
    }
  ]);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeTheme(): void {
    this.currentTheme.update(t => t === 'white' ? 'dark' : 'white');
  }
}
