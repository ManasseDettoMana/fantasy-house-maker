import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../models/auth.model';
import { Router } from '@angular/router';
import { AlertCloseable } from '../../utils/alert-closeable/alert-closeable';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, AlertCloseable, FloatLabelModule, InputTextModule, PasswordModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export default class LoginForm {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isPassword = signal(true);

  eyePassword = computed(()=> this.isPassword() ? 'pi pi-eye-slash' : 'pi pi-eye');
  typeInputPassword = computed(()=> this.isPassword() ? 'password' : 'text');

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void{
    if(this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const credentials = this.loginForm.getRawValue() as LoginRequest;

    this.authService.login(credentials)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: ()=>{
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: ()=>{
        this.errorMessage.set('Login fallito');
        this.isLoading.set(false);
      }
    });
  }

  togglePassword(): void {
    this.isPassword.update(v => !v);
  }
}
