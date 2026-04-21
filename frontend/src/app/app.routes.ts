import { Routes } from '@angular/router';
import { LoginForm } from './login/login-form/login-form';

export const routes: Routes = [
    { path: 'login', component: LoginForm },
    { path: '', component: LoginForm },
    { path: '**', component: LoginForm },
];
