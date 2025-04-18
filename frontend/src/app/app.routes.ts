import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'sectors',
    pathMatch: 'full',
  },
  {
    path: 'sectors',
    loadComponent: () => import('./sectors/sectors.page').then( m => m.SectorsPage)
  },
];
