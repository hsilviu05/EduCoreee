import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Join EduCore</h1>
          <p class="auth-subtitle">Create your account to start your learning journey</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                placeholder="Enter your first name"
                class="form-control"
                [class.error]="isFieldInvalid('firstName')"
              />
              <div class="form-error" *ngIf="isFieldInvalid('firstName')">
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                placeholder="Enter your last name"
                class="form-control"
                [class.error]="isFieldInvalid('lastName')"
              />
              <div class="form-error" *ngIf="isFieldInvalid('lastName')">
                Last name is required
              </div>
            </div>
          </div>

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
            <label for="role" class="form-label">Role</label>
            <select
              id="role"
              formControlName="role"
              class="form-control"
              [class.error]="isFieldInvalid('role')"
            >
              <option value="0">Student</option>
              <option value="1">Professor</option>
              <option value="2">Admin</option>
            </select>
            <div class="form-error" *ngIf="isFieldInvalid('role')">
              Please select a role
            </div>
          </div>

          <div class="form-row">
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
                Password must be at least 6 characters
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                placeholder="Confirm your password"
                class="form-control"
                [class.error]="isFieldInvalid('confirmPassword')"
              />
              <div class="form-error" *ngIf="isFieldInvalid('confirmPassword')">
                Passwords do not match
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg"
            [disabled]="registerForm.invalid || isLoading"
          >
            <span class="spinner" *ngIf="isLoading"></span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>

          <div class="auth-footer">
            <p class="text-center">
              Already have an account? 
              <a routerLink="/auth/login" class="text-primary">Sign in</a>
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
      max-width: 500px;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
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
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }
    }

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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  UserRole = UserRole;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['0', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  onSubmit(): void {
    console.log('Form submitted, valid:', this.registerForm.valid);
    console.log('Form values:', this.registerForm.value);
    console.log('Form errors:', this.registerForm.errors);

    if (!this.registerForm.valid) {
      console.log('Form is invalid, errors:', this.registerForm.errors);
      console.log('Individual field errors:');
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.errors) {
          console.log(`${key}:`, control.errors);
        }
      });
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const roleValue = this.registerForm.get('role')?.value;
    console.log('Form role value:', roleValue, typeof roleValue);
    console.log('Form raw values:', this.registerForm.value);

    if (!roleValue || roleValue === '' || roleValue === null || roleValue === undefined || isNaN(parseInt(roleValue))) {
      this.errorMessage = 'Please select a valid role';
      this.isLoading = false;
      return;
    }

    const parsedRole = parseInt(roleValue);

    const userData: RegisterRequest = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      role: parsedRole,
      password: this.registerForm.get('password')?.value
    };

    console.log('Sending registration data:', userData);
    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        console.error('Error details:', error.error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword && confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }
} 