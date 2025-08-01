import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div class="profile-content">
        <div class="profile-section">
          <h2>Personal Information</h2>
          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                formControlName="firstName"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                class="form-control"
                readonly
              >
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid">
              Update Profile
            </button>
          </form>
        </div>

        <div class="profile-section">
          <h2>Change Password</h2>
          <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input 
                type="password" 
                id="currentPassword" 
                formControlName="currentPassword"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                formControlName="newPassword"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                formControlName="confirmPassword"
                class="form-control"
              >
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="passwordForm.invalid">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .profile-header {
      margin-bottom: 30px;
    }

    .profile-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .profile-header p {
      color: #666;
    }

    .profile-content {
      display: grid;
      gap: 30px;
    }

    .profile-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .profile-section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #2c3e50;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-control[readonly] {
      background-color: #f8f9fa;
      color: #666;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 10px;
      }
    }
  `]
})
export class ProfileComponent {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const profileData = this.profileForm.value;
      // Implement profile update logic
      console.log('Updating profile:', profileData);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value;
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        console.error('Passwords do not match');
        return;
      }
      // Implement password change logic
      console.log('Changing password:', passwordData);
    }
  }
} 