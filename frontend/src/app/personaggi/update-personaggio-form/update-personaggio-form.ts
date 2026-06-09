import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonaggioService } from '../../core/services/personaggio.service';
import { PersonaggioRequest } from '../../models/personaggio.model';
import { forkJoin, switchMap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CasataService } from '../../core/services/casata.service';
import { CasataResponse } from '../../models/casata.model';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-update-personaggio-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, SelectModule, RouterLink],
  templateUrl: './update-personaggio-form.html',
  styleUrl: './update-personaggio-form.scss',
})
export default class UpdatePersonaggioForm implements OnInit{
  private readonly fb             = inject(FormBuilder);
  private readonly router         = inject(Router);
  private readonly route          = inject(ActivatedRoute);
  private readonly destroyRef     = inject(DestroyRef);
  private readonly personaggioSvc = inject(PersonaggioService);
  private readonly casataSvc      = inject(CasataService);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  protected isLoading    = signal(true);
  protected errorMessage = signal<string | null>(null);
  protected casate       = signal<CasataResponse[]>([]);

  protected readonly updatePersonaggioForm = this.fb.nonNullable.group({
    nome:   ['', Validators.required],
    casata: [null as CasataResponse | null, Validators.required]
  });

  ngOnInit(): void {
    this.caricaDati();
  }

  private caricaDati(): void {
    forkJoin({
      personaggio: this.personaggioSvc.getById(this.id),
      casate:      this.casataSvc.getAll(),
    })
    .pipe(
      finalize(() => this.isLoading.set(false)),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe({
      next: ({ personaggio, casate }) => {
        this.casate.set(casate);

        // Trova l'oggetto CasataResponse corrispondente all'ID del personaggio
        // p-select confronta per referenza/oggetto
        const casataSelezionata = casate.find(c => c.id === personaggio.casataId) ?? null;

        this.updatePersonaggioForm.patchValue({
          nome:   personaggio.nome,
          casata: casataSelezionata,
        });
      },
      error: () => this.errorMessage.set('Errore nel caricamento dei dati.'),
    });
  }


  protected aggiornaPersonaggio(): void {
    if (this.updatePersonaggioForm.invalid) return;

    const { nome, casata } = this.updatePersonaggioForm.getRawValue();

    // casata può essere null se il form è stato manomesso
    if (!casata) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // esisteInCasata riceve il nome E il casataId corretto dalla select
    this.personaggioSvc.esisteInCasata(nome, casata.id)
      .pipe(
        switchMap((esiste) => {
          if (esiste) {
            throw new Error(`"${nome}" esiste già nella casata "${casata.nome}".`);
          }

          const payload: PersonaggioRequest = { nome, casataId: casata.id };
          return this.personaggioSvc.aggiorna(this.id, payload);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next:  () => this.router.navigate(['/personaggi']),
        error: (err: Error) => this.errorMessage.set(err.message),
      });
  }
}