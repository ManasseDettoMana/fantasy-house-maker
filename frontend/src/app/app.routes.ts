import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

    { 
        path: 'login', 
        loadComponent: () => import('./login/login-form/login-form'),
    },
    { 
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard/dashboard'),
        canActivate: [authGuard]
    },
    { 
        path: 'casate', 
        loadComponent: () => import('./casate/casate-list-2/casate-list-2'),
        canActivate: [authGuard]
    },
    { 
        path: 'new-casata-form', 
        loadComponent: () => import('./casate/new-casata-form/new-casata-form'),
        canActivate: [authGuard]
    },
    { 
        path: 'update-casata-form/:id', 
        loadComponent: () => import('./casate/update-casata-form/update-casata-form'),
        canActivate: [authGuard]
    },
    { 
        path: 'personaggi', 
        loadComponent: () => import('./personaggi/personaggi'),
        canActivate: [authGuard]
    },
    { 
        path: 'new-personaggio-form', 
        loadComponent: () => import('./personaggi/new-personaggio-form/new-personaggio-form'),
        canActivate: [authGuard]
    },
    { 
        path: 'update-personaggio-form/:id', 
        loadComponent: () => import('./personaggi/update-personaggio-form/update-personaggio-form'),
        canActivate: [authGuard]
    },
    { 
        path: 'casata/:id/tree', 
        loadComponent: () => import('./personaggi/albero-g/albero-g'),
        canActivate: [authGuard]
    },
    { 
        path: 'form-dinamico', 
        loadComponent: () => import('./utils/form-dinamico/form-dinamico'),
        canActivate: [authGuard]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: '**', redirectTo: 'login' },
];
