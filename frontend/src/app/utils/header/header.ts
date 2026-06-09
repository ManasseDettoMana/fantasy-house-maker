import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from "@angular/router";
import { map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-header',
  imports: [RouterLink, ButtonModule, MenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  authService = inject(AuthService);

  isLogged = signal<boolean>(this.authService.isLoggedIn());
  isDashboard = computed(() => this.currentUrl()?.startsWith('/dashboard'));

  private currentUrl = toSignal(
    this.router.events.pipe(map(() => this.router.url)),
    { initialValue: this.router.url }
  );

  readonly options = signal<MenuItem[]>([
    {
      label: 'Opzioni',
      items: [
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

}
