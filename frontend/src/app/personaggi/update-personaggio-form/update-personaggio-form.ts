import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaggioService } from '../../core/services/personaggio.service';
import { PersonaggioRequest, PersonaggioResponse } from '../../models/personaggio.model';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-update-personaggio-form',
  imports: [],
  templateUrl: './update-personaggio-form.html',
  styleUrl: './update-personaggio-form.scss',
})
export class UpdatePersonaggioForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private readonly personaggioService = inject(PersonaggioService);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  updatePersonaggioForm = this.fb.group({
    nome: ['', Validators.required],
    casata: ['', Validators.required]
  });

  constructor(){
    this.caricaCasata();
  }

  private caricaCasata(): void {
    this.isLoading.set(true);

    this.personaggioService
      .getById(this.id)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          this.updatePersonaggioForm.patchValue({
            nome: data.nome,
            casata: data.id.toString()
          });
        },
        error: (err) => this.errorMessage.set(err.message),
      });
  }
  onSubmit(): void {
    if (this.updatePersonaggioForm.invalid) return;

    const payload: PersonaggioRequest = {
      nome: this.updatePersonaggioForm.value.nome!,
      casataId: parseFloat(this.updatePersonaggioForm.value.casata!)
    };

    this.isLoading.set(true);

    this.personaggioService
      .aggiorna(this.id, payload)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.router.navigate(['/personaggi']),
        error: (err) => this.errorMessage.set(err.message),
      });
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }

}
