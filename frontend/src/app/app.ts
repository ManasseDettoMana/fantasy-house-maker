import { Component, computed, inject, signal } from '@angular/core';
import {  NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './utils/header/header';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  template: `
    @if (mostraHeader()) {
      <app-header />
    }
    <router-outlet />
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Fantasy Houses Maker');
  private readonly router = inject(Router);

  // Converte gli eventi di navigazione in un signal con la URL corrente
  private readonly urlCorrente = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected readonly mostraHeader = computed(
    () => this.urlCorrente() !== '/login'
  );
}