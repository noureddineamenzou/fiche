import {
    canActivate,
    redirectLoggedInTo,
    redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { CrudComponent } from './crud/components/crud/crud.component';
import { FormComponent } from './crud/components/form/form.component';



export const NGS_TITLE_SUFFIX = ' | NGS';

const redirectUnauthorizedToLogin = () =>
    redirectUnauthorizedTo(['auth/login']);
const redirectLoggedInToDomain = () => redirectLoggedInTo(['/fiche']);

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: '',
        loadComponent: () => import('./layouts/basic/basic.component').then(m => m.BasicLayoutComponent),
        children: [
            {
                path: 'auth',
                loadChildren: () => import('./auth/auth.routes'),
                ...canActivate(redirectLoggedInToDomain),
            },
            {
                path: 'fiche',
                loadComponent: () =>
                    import('./crud/components/crud/crud.component').then(m => m.CrudComponent),
                  ...canActivate(redirectUnauthorizedToLogin),

            },
  { path: 'form/:id', component: FormComponent },
],
},
{
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent),
},
];
