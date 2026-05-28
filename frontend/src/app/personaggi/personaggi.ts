import { PersonaggioResponse } from './../models/personaggio.model';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { PersonaggioService } from '../core/services/personaggio.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { TableModule } from "primeng/table";
import { CustomDeleteButton } from '../utils/mana-delete-dialog/mana-delete-dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-personaggi',
  imports: [ButtonModule, TableModule, CustomDeleteButton, ProgressSpinnerModule],
  templateUrl: './personaggi.html',
  styleUrl: './personaggi.scss',
})
export default class Personaggi {
  private readonly personaggioService = inject(PersonaggioService);
  private readonly router = inject(Router);
  private destroyRef = inject(DestroyRef);

  personaggi = signal<PersonaggioResponse[]>([]);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  ngOnInit(): void{
    this.caricaPersonaggi();
  }

  caricaPersonaggi(): void{
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.personaggioService.getAll()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data: PersonaggioResponse[]) => {
        this.personaggi.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Errore nel caricamento dei personaggi');
        this.isLoading.set(false);
        console.log(err);
      }
    });
  }
  
  eliminaPersonaggio(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.personaggioService.elimina(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.isLoading.set(false);
        this.caricaPersonaggi();
      },
      error: (err) => {
        this.errorMessage.set(err);
        this.isLoading.set(false);
      }
    })
  }

  goToNewPersonaggioForm(): void {
    this.router.navigate(['/new-personaggio-form']);
  }

  goToUpdatePersonaggioForm(id: number): void {
    this.router.navigate(['/update-personaggio-form']);
  }
}
