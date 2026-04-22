import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CasataService } from '../../core/services/casata.service';
import { CasataRequest } from '../../models/casata.model';
import { AlertCloseable } from '../../utils/alert-closeable/alert-closeable';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-casata-form',
  imports: [ReactiveFormsModule, AlertCloseable],
  templateUrl: './new-casata-form.html',
  styleUrl: './new-casata-form.scss',
})
export class NewCasataForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private readonly casataService = inject(CasataService);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  newCasataForm = this.fb.group({
    nome: ['', Validators.required],
    motto: ['', Validators.required],
    stemma: ['', Validators.required]
  })

  onSubmit(): void{
    if(this.newCasataForm.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const datiCasata = this.newCasataForm.getRawValue() as CasataRequest;

    this.casataService.crea(datiCasata).subscribe({
      next: ()=>{
        this.isLoading.set(false);
        this.router.navigate(['/casate']);
      }, error: (err)=>{
        this.errorMessage.set('Creazione fallita');
        this.isLoading.set(false);
      },
      complete: ()=>{
        this.isLoading.set(false);
        this.router.navigate(['/casate']);
      }
    });
  }

}
