import { Component, computed, DOCUMENT, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

export type Theme = 'white' | 'dark';
@Component({
  selector: 'app-header',
  imports: [
    RouterLink, 
    ButtonModule, 
    MenuModule, 
    RouterLinkActive, 
    ConfirmDialogModule, 
    ToastModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  authService = inject(AuthService);  
  confirmationService = inject(ConfirmationService);
  // prova cambio tema
  private readonly document = inject(DOCUMENT);
  private readonly _applyTheme = effect(() => {
    const theme = this.currentTheme();
    this.document.body.classList.toggle('dark-theme', theme === 'dark');
  });

  // currentTheme = signal<Theme>('white');
  // prova con localstorage
  currentTheme = signal<Theme>(
    (localStorage.getItem('theme') as Theme) ?? 'white'
  )
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
          command: () => this.confermaLogout()
        }
      ]
    }
  ]);

  confermaLogout(): void {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler effettuare il logout?',
      header: 'Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: {
        label: 'Esci',
        severity: 'danger',
        icon: 'pi pi-sign-out'
      },
      rejectButtonProps: {
        label: 'Annulla',
        severity: 'secondary',
        icon: 'pi pi-times'
      },
      accept: () => {
        this.logout();
      }
    })
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeTheme(): void {
    this.currentTheme.update(t => {
      const next = t === 'white' ? 'dark' : 'white';
      localStorage.setItem('theme', next);
      return next;
    });
  }
}
