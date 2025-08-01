import { Routes } from '@angular/router';

export const MY_COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./my-courses-list/my-courses-list.component').then(m => m.MyCoursesListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./my-course-detail/my-course-detail.component').then(m => m.MyCourseDetailComponent)
  },
  {
    path: ':id/lessons/:lessonId',
    loadComponent: () => import('./lesson-viewer/lesson-viewer.component').then(m => m.LessonViewerComponent)
  }
]; 