import { CasataService } from './../../core/services/casata.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CasataResponse } from '../../models/casata.model';
import { Router, RouterLink } from '@angular/router';
import { CustomDeleteButton } from '../../utils/mana-delete-dialog/mana-delete-dialog';
import { ButtonModule } from 'primeng/button';
import { DestroyRef } from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
@Component({
  selector: 'app-casate-list-2',
  imports: [TableModule, CustomDeleteButton, ButtonModule, RouterLink, PaginatorModule],
  templateUrl: './casate-list-2.html',
  styleUrl: './casate-list-2.scss',
})
export default class CasateList2 implements OnInit{
  private readonly casataService = inject(CasataService);
  // private readonly router = inject(Router);
  private destroyRef = inject(DestroyRef);

  casate = signal<CasataResponse[]>([]);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);
  // rows = signal<number>(5);

  ngOnInit(): void {
    this.caricaCasate();
  }

  private caricaCasate(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.casataService.getAll()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data: CasataResponse[]) => {
        this.casate.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Errore nel caricamento delle casate.');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  eliminaCasata(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.casataService.elimina(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.isLoading.set(false);
        this.caricaCasate();
      },
      error: (err) => {
        this.errorMessage.set(err);
        this.isLoading.set(false);
      }
    });
  }

  // per adesso lo lascio qua ma vediamo perché devo mettere altri record
  // onPageChange(event: PaginatorState) {
  //   this.rows.set(event.first ?? 5);
  // }
}