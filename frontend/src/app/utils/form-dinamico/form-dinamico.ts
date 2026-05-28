import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-form-dinamico',
  imports: [ReactiveFormsModule],
  templateUrl: './form-dinamico.html',
  styleUrl: './form-dinamico.scss',
})
export default class FormDinamico {
  private readonly fb = inject(FormBuilder);

  formDinamico = this.fb.group({
    domanda1: ['', Validators.required],
    domanda2: ['', Validators.required],
    domanda3: ['']
  });
}
