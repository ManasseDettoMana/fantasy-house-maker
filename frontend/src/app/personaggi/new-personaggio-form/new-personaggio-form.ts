import { Component, output, inject, signal, DestroyRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CasataService } from '../../core/services/casata.service';
import { PersonaggioService } from '../../core/services/personaggio.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CasataResponse } from '../../models/casata.model';
import { PersonaggioRequest } from '../../models/personaggio.model';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-personaggio-form',
  imports: [
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule
  ],
  templateUrl: './new-personaggio-form.html',
  styleUrl: './new-personaggio-form.scss',
})
export default class NewPersonaggioForm {

  readonly salvato = output<void>();

  private personaggioService = inject(PersonaggioService);
  private casataService = inject(CasataService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  casate = signal<CasataResponse[]>([]);

  newPersonaggioForm = this.fb.group({
    nome: ['', Validators.required],
    casata: [null as CasataResponse | null, Validators.required],
  });

  constructor() {
    this.casataService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.casate.set(data),
        error: () => this.errorMessage.set('Errore nel caricamento delle casate.')
      });
  }

  onSubmit(): void {
    if (this.newPersonaggioForm.invalid) return;

    const nome = this.newPersonaggioForm.value.nome!;
    const casata = this.newPersonaggioForm.value.casata as CasataResponse;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.personaggioService.esisteInCasata(nome, casata.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (esiste) => {
          if (esiste) {
            this.isLoading.set(false);
            this.errorMessage.set(`"${nome}" esiste già nella casata ${casata.nome}.`);
            return;
          }

          const request: PersonaggioRequest = {
            nome,
            casataId: casata.id
          };

          this.personaggioService.crea(request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.isLoading.set(false);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Salvato',
                  detail: `${nome} creato con successo.`
                });
                this.salvato.emit();
                this.newPersonaggioForm.reset();
                this.router.navigate(['/personaggi']);
              },
              error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set('Errore durante la creazione del personaggio.');
                console.log(err)
              }
            });
        },
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('Errore durante la verifica del personaggio.');
        }
      });
  }

  goToPersonaggi(): void {
    this.router.navigate(['/personaggi']);
  }
}