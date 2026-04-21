import { Component, inject } from '@angular/core';
import {FormControl, ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);
  isLoggedIn = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void{
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log(this.loginForm.value);
    this.isLoggedIn = true;
  }
}
