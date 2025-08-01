import { Routes } from '@angular/router';

export const QUIZ_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./quiz-list/quiz-list.component').then(m => m.QuizListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./quiz-detail/quiz-detail.component').then(m => m.QuizDetailComponent)
  },
  {
    path: ':id/take',
    loadComponent: () => import('./quiz-taker/quiz-taker.component').then(m => m.QuizTakerComponent)
  },
  {
    path: ':id/results',
    loadComponent: () => import('./quiz-results/quiz-results.component').then(m => m.QuizResultsComponent)
  }
]; 