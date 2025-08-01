import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5166/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      this.loadUserFromStorage();
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser && !!this.getToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.currentUserSubject.next(response.user);
          this.saveUserToStorage(response.user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    console.log('AuthService: Sending registration request to:', `${this.API_URL}/auth/register`);
    console.log('AuthService: Request data:', userData);
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          console.log('AuthService: Registration response:', response);
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.currentUserSubject.next(response.user);
          this.saveUserToStorage(response.user);
        })
      );
  }

  logout(): void {
    this.clearTokens();
    this.currentUserSubject.next(null);
    this.clearUserFromStorage();
  }

  refreshToken(): Observable<{ token: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<{ token: string; refreshToken: string }>(
      `${this.API_URL}/auth/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
      })
    );
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private saveUserToStorage(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('current_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      }
    }
  }

  private clearUserFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current_user');
    }
  }
} 