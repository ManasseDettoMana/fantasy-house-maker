import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-form-dinamico',
  imports: [ReactiveFormsModule],
  templateUrl: './form-dinamico.html',
  styleUrl: './form-dinamico.scss',
})
export class FormDinamico {
  private readonly fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  

  formDinamico = this.fb.group({
    domanda1: ['', Validators.required],
    domanda2: ['', Validators.required],
    domanda3: ['']
  });
}
