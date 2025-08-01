import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, Lesson, CourseProgress } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly API_URL = 'http://localhost:5166/api';

  constructor(private http: HttpClient) {}

  // Course operations
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_URL}/courses`);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.API_URL}/courses/${id}`);
  }

  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_URL}/enrolled-courses`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.API_URL}/courses`, course);
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.API_URL}/courses/${id}`, course);
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/courses/${id}`);
  }

  // Lesson operations
  getLessonsByCourseId(courseId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.API_URL}/courses/${courseId}/lessons`);
  }

  getLessonById(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.API_URL}/lessons/${id}`);
  }

  createLesson(lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.API_URL}/lessons`, lesson);
  }

  updateLesson(id: string, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.API_URL}/lessons/${id}`, lesson);
  }

  deleteLesson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/lessons/${id}`);
  }

  // Progress operations
  getCourseProgress(courseId: string): Observable<CourseProgress> {
    return this.http.get<CourseProgress>(`${this.API_URL}/courses/${courseId}/progress`);
  }

  updateCourseProgress(progress: Partial<CourseProgress>): Observable<CourseProgress> {
    return this.http.put<CourseProgress>(`${this.API_URL}/courses/${progress.courseId}/progress`, progress);
  }

  enrollInCourse(courseId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/courses/${courseId}/enroll`, {});
  }

  completeLesson(lessonId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/lessons/${lessonId}/complete`, {});
  }

  // Search and filter
  searchCourses(query: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_URL}/courses/search?q=${query}`);
  }

  getCoursesByCategory(category: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_URL}/courses/category/${category}`);
  }
} 