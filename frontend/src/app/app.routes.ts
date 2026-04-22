import { Routes } from '@angular/router';
import { LoginForm } from './login/login-form/login-form';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { CasateList } from './casate/casate-list/casate-list';
import { NewCasataForm } from './casate/new-casata-form/new-casata-form';

export const routes: Routes = [
    { path: 'login', component: LoginForm },
    { path: 'dashboard', component: Dashboard },
    { path: 'casate', component: CasateList },
    { path: 'new-casata-form', component: NewCasataForm },
    { path: '', component: Dashboard },
    { path: '**', component: Dashboard },
];
