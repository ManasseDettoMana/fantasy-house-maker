import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CasataService } from '../../core/services/casata.service';
import { CasataRequest, CasataResponse } from '../../models/casata.model';
import { AlertCloseable } from '../../utils/alert-closeable/alert-closeable';

@Component({
  selector: 'app-update-casata-form',
  standalone: true,
  imports: [ReactiveFormsModule, AlertCloseable],
  templateUrl: './update-casata-form.html',
  styleUrl: './update-casata-form.scss',
})
export default class UpdateCasataForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private readonly casataService = inject(CasataService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  casata = signal<CasataResponse | null>(null);

  updateCasataForm = this.fb.group({
    nome: ['', Validators.required],
    motto: ['', Validators.required],
    stemma: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.caricaCasata(id);
  }

  private caricaCasata(id: number): void {
    this.isLoading.set(true);
    this.casataService.getById(id).subscribe({
      next: (data) => {
        this.casata.set(data);
        this.updateCasataForm.patchValue({
          nome: data.nome,
          motto: data.motto,
          stemma: data.stemma
        });
      },
      error: (err) => this.errorMessage.set(err.message),
      complete: () => this.isLoading.set(false)
    });
  }

  onSubmit(): void {
    if (this.updateCasataForm.invalid) return;

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const payload = this.updateCasataForm.value as CasataRequest; 

    this.isLoading.set(true);
    this.casataService.aggiorna(id, payload).subscribe({
      next: () => this.router.navigate(['/casate']),
      error: (err) => this.errorMessage.set(err.message),
      complete: () => this.isLoading.set(false)
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/casate']);
  }
}