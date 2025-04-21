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
  {
    path: 'start-mcq',
    loadComponent: () => import('./start-mcq/start-mcq.page').then( m => m.StartMCQPage)
  },
  {
    path: 'study',
    loadComponent: () => import('./study/study.page').then( m => m.StudyPage)
  },
  {
    path: 'skills',
    loadComponent: () => import('./skills/skills.page').then( m => m.SkillsPage)
  },
  {
    path: 'score',
    loadComponent: () => import('./score/score.page').then( m => m.ScorePage)
  },
];
