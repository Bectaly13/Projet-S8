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
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats.page').then( m => m.StatsPage)
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq.page').then( m => m.FaqPage)
  },
];
