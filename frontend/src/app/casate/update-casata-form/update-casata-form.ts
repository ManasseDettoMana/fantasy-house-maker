import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AlertCloseable } from '../../utils/alert-closeable/alert-closeable';
import { Router } from '@angular/router';
import { CasataService } from '../../core/services/casata.service';
import { CasataRequest, CasataResponse } from '../../models/casata.model';

@Component({
  selector: 'app-update-casata-form',
  imports: [AlertCloseable, ReactiveFormsModule],
  templateUrl: './update-casata-form.html',
  styleUrl: './update-casata-form.scss',
})
export class UpdateCasataForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private readonly casataService = inject(CasataService);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  casata = signal<CasataResponse | null>(null);


  
}
