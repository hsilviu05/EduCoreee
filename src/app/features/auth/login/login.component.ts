import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Welcome Back!</h1>
          <p class="auth-subtitle">Sign in to your EduCore account to continue learning</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="Enter your email"
              class="form-control"
              [class.error]="isFieldInvalid('email')"
            />
            <div class="form-error" *ngIf="isFieldInvalid('email')">
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="Enter your password"
              class="form-control"
              [class.error]="isFieldInvalid('password')"
            />
            <div class="form-error" *ngIf="isFieldInvalid('password')">
              Password is required
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span class="spinner" *ngIf="isLoading"></span>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>

          <div class="auth-footer">
            <p class="text-center">
              Don't have an account? 
              <a routerLink="/auth/register" class="text-primary">Sign up</a>
            </p>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      padding: var(--spacing-lg);
    }

    .auth-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      padding: var(--spacing-2xl);
      width: 100%;
      max-width: 450px;
      animation: slideInUp 0.6s ease-in-out;
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }

    .auth-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .auth-subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
      margin: 0;
    }

    .auth-form {
      width: 100%;
    }

    .auth-footer {
      margin-top: var(--spacing-xl);
      text-align: center;
    }

    .auth-footer p {
      color: var(--text-secondary);
      margin: 0;
    }

    .auth-footer a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
      transition: color var(--transition-fast);
    }

    .auth-footer a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive Design */
    @media (max-width: 480px) {
      .auth-container {
        padding: var(--spacing-md);
      }

      .auth-card {
        padding: var(--spacing-xl);
      }

      .auth-title {
        font-size: 1.75rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
} 