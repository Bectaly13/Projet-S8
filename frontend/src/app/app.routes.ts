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
  {
    path: 'domains',
    loadComponent: () => import('./domains/domains.page').then( m => m.DomainsPage)
  },
  {
    path: 'chapters',
    loadComponent: () => import('./chapters/chapters.page').then( m => m.ChaptersPage)
  },
];
