import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CasataService } from '../../core/services/casata.service';
import { CasataResponse } from '../../models/casata.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-casate-list',
  imports: [],
  templateUrl: './casate-list.html',
  styleUrl: './casate-list.scss',
})
export class CasateList {
  private readonly casataService = inject(CasataService);
  private readonly router = inject(Router);

  casate = signal<CasataResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.caricaCasate();
  }

  private caricaCasate(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.casataService.getAll().subscribe({
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

  eliminaCasata(id: number): void{
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.casataService.elimina(id).subscribe({
      next: ()=>{
        this.isLoading.set(false);
        this.caricaCasate();
      },
      error: (err)=>{
        this.errorMessage.set(err);
        this.isLoading.set(false);
      }
    });
  }

  goToNewCasataForm(): void {
    this.router.navigate(['/new-casata-form']);
  }

}
