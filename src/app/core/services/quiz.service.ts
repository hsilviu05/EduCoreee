import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz, QuizAttempt } from '../models/quiz.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly API_URL = 'http://localhost:5166/api';

  constructor(private http: HttpClient) {}

  // Quiz operations
  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.API_URL}/quizzes`);
  }

  getQuizById(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.API_URL}/quizzes/${id}`);
  }

  getQuizzesByCourseId(courseId: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.API_URL}/quizzes`).pipe(
      // Filter quizzes by courseId on the client side since backend doesn't support this yet
      map(quizzes => quizzes.filter(quiz => quiz.courseId === courseId))
    );
  }

  createQuiz(quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.API_URL}/quizzes`, quiz);
  }

  updateQuiz(id: string, quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.API_URL}/quizzes/${id}`, quiz);
  }

  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/quizzes/${id}`);
  }

  // Quiz attempts
  startQuiz(quizId: string): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(`${this.API_URL}/quizzes/${quizId}/start`, {});
  }

  submitQuiz(quizId: string, answers: any): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(`${this.API_URL}/quizzes/${quizId}/submit`, { answers });
  }

  getQuizAttempts(quizId: string): Observable<QuizAttempt[]> {
    return this.http.get<QuizAttempt[]>(`${this.API_URL}/quizzes/attempts`);
  }

  getQuizAttemptById(attemptId: string): Observable<QuizAttempt> {
    return this.http.get<QuizAttempt>(`${this.API_URL}/quiz-attempts/${attemptId}`);
  }

  // Quiz results
  getQuizResults(quizId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/quizzes/${quizId}/results`);
  }

  getMyQuizResults(): Observable<QuizAttempt[]> {
    return this.http.get<QuizAttempt[]>(`${this.API_URL}/quizzes/attempts`);
  }
} 