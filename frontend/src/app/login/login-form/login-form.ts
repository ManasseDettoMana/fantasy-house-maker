import { routes } from './../../app.routes';
import { Component, inject, signal } from '@angular/core';
import {FormControl, ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../models/auth.model';
import { Router } from '@angular/router';
import { AlertCloseable } from '../../utils/alert-closeable/alert-closeable';
@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, AlertCloseable],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export default class LoginForm {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private router = inject(Router);
  // isLoggedIn = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);


  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void{
    if(this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const credentials = this.loginForm.getRawValue() as LoginRequest;

    this.authService.login(credentials).subscribe({
      next: ()=>{
        // this.isLoggedIn.set(true);
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: ()=>{
        this.errorMessage.set('Login fallito');
        this.isLoading.set(false);
      }
      //,
      // complete: ()=>{
      //   this.isLoading.set(false);
      //   this.router.navigate(['/dashboard']);
      // }
    });
  }
}
