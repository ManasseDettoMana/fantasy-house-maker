import { Routes } from '@angular/router';
import { LoginForm } from './login/login-form/login-form';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { CasateList } from './casate/casate-list/casate-list';
import { NewCasataForm } from './casate/new-casata-form/new-casata-form';
import { UpdateCasataForm } from './casate/update-casata-form/update-casata-form';
import { FormDinamico } from './utils/form-dinamico/form-dinamico';

export const routes: Routes = [
    { path: 'login', component: LoginForm },
    { path: 'dashboard', component: Dashboard },
    { path: 'casate', component: CasateList },
    { path: 'new-casata-form', component: NewCasataForm },
    { path: 'update-casata-form/:id', component: UpdateCasataForm },
    { path: 'form-dinamico', component: FormDinamico },
    { path: '', component: Dashboard },
    { path: '**', component: Dashboard },
];
