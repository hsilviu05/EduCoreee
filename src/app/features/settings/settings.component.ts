import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>Application Settings</h1>
        <p>Customize your learning experience</p>
      </div>

      <div class="settings-content">
        <div class="settings-section">
          <h2>Notifications</h2>
          <form [formGroup]="notificationForm" (ngSubmit)="saveNotificationSettings()">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive email notifications for course updates and announcements</p>
              </div>
              <label class="toggle">
                <input type="checkbox" formControlName="emailNotifications">
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Push Notifications</h3>
                <p>Receive push notifications for real-time updates</p>
              </div>
              <label class="toggle">
                <input type="checkbox" formControlName="pushNotifications">
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Course Reminders</h3>
                <p>Get reminded about incomplete courses and lessons</p>
              </div>
              <label class="toggle">
                <input type="checkbox" formControlName="courseReminders">
                <span class="slider"></span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary">Save Notification Settings</button>
          </form>
        </div>

        <div class="settings-section">
          <h2>Display Preferences</h2>
          <form [formGroup]="displayForm" (ngSubmit)="saveDisplaySettings()">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Dark Mode</h3>
                <p>Switch to dark theme for better viewing in low light</p>
              </div>
              <label class="toggle">
                <input type="checkbox" formControlName="darkMode">
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Auto-play Videos</h3>
                <p>Automatically play video lessons when opened</p>
              </div>
              <label class="toggle">
                <input type="checkbox" formControlName="autoPlayVideos">
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Show Progress</h3>
                <p>Display progress bars and completion indicators</p>
              </div>
              <label class="toggle">
                <input type="checkbox" formControlName="showProgress">
                <span class="slider"></span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary">Save Display Settings</button>
          </form>
        </div>

        <div class="settings-section">
          <h2>Privacy & Security</h2>
          <form [formGroup]="privacyForm" (ngSubmit)="savePrivacySettings()">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Profile Visibility</h3>
                <p>Allow other users to see your profile and progress</p>
              </div>
              <label class="toggle">
                <input type="checkbox" formControlName="profileVisible">
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Data Analytics</h3>
                <p>Help improve the platform by sharing anonymous usage data</p>
              </div>
              <label class="toggle">
                <input type="checkbox" formControlName="dataAnalytics">
                <span class="slider"></span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary">Save Privacy Settings</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .settings-header {
      margin-bottom: 30px;
    }

    .settings-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .settings-header p {
      color: #666;
    }

    .settings-content {
      display: grid;
      gap: 30px;
    }

    .settings-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .settings-section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #e1e5e9;
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-info h3 {
      color: #2c3e50;
      margin-bottom: 4px;
      font-size: 16px;
    }

    .setting-info p {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 34px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
      margin-top: 20px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 10px;
      }

      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
    }
  `]
})
export class SettingsComponent {
  notificationForm: FormGroup;
  displayForm: FormGroup;
  privacyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      pushNotifications: [true],
      courseReminders: [true]
    });

    this.displayForm = this.fb.group({
      darkMode: [false],
      autoPlayVideos: [true],
      showProgress: [true]
    });

    this.privacyForm = this.fb.group({
      profileVisible: [true],
      dataAnalytics: [true]
    });
  }

  saveNotificationSettings(): void {
    if (this.notificationForm.valid) {
      console.log('Saving notification settings:', this.notificationForm.value);
      // Implement save logic
    }
  }

  saveDisplaySettings(): void {
    if (this.displayForm.valid) {
      console.log('Saving display settings:', this.displayForm.value);
      // Implement save logic
    }
  }

  savePrivacySettings(): void {
    if (this.privacyForm.valid) {
      console.log('Saving privacy settings:', this.privacyForm.value);
      // Implement save logic
    }
  }
} 