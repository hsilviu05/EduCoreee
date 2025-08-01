import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-dashboard">
      <div class="welcome-section">
        <h1 class="welcome-title">Admin Dashboard</h1>
        <p>Manage your EduCore platform</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">people</span>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalUsers }}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">school</span>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalCourses }}</h3>
            <p>Total Courses</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">quiz</span>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalQuizzes }}</h3>
            <p>Total Quizzes</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">trending_up</span>
          </div>
          <div class="stat-content">
            <h3>{{ stats.activeUsers }}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="section">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let activity of recentActivity">
              <div class="activity-icon">
                <span class="material-icons">{{ activity.icon }}</span>
              </div>
              <div class="activity-content">
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.description }}</p>
                <span class="activity-time">{{ activity.time | date:'short' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Quick Actions</h2>
          <div class="quick-actions">
            <a routerLink="/admin/users" class="action-card">
              <span class="material-icons">people</span>
              <h3>Manage Users</h3>
              <p>View and manage user accounts</p>
            </a>
            
            <a routerLink="/admin/courses" class="action-card">
              <span class="material-icons">school</span>
              <h3>Manage Courses</h3>
              <p>Create and edit courses</p>
            </a>
            
            <a routerLink="/admin/analytics" class="action-card">
              <span class="material-icons">analytics</span>
              <h3>View Analytics</h3>
              <p>Platform performance metrics</p>
            </a>
            
            <a routerLink="/admin/settings" class="action-card">
              <span class="material-icons">settings</span>
              <h3>Platform Settings</h3>
              <p>Configure platform options</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .dashboard-header {
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 32px;
    }

    .dashboard-header p {
      color: #666;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
    }

    .stat-icon .material-icons {
      color: white;
      font-size: 28px;
    }

    .stat-content h3 {
      color: #2c3e50;
      margin: 0 0 5px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .stat-content p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .dashboard-content {
      display: grid;
      gap: 30px;
    }

    .section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .activity-list {
      display: grid;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      border-radius: 8px;
      background: #f8f9fa;
      transition: background-color 0.3s ease;
    }

    .activity-item:hover {
      background: #e9ecef;
    }

    .activity-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
    }

    .activity-icon .material-icons {
      color: white;
      font-size: 20px;
    }

    .activity-content h4 {
      color: #2c3e50;
      margin: 0 0 5px 0;
      font-size: 16px;
    }

    .activity-content p {
      color: #666;
      margin: 0 0 8px 0;
      font-size: 14px;
    }

    .activity-time {
      color: #999;
      font-size: 12px;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .action-card {
      display: block;
      padding: 24px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .action-card:hover {
      transform: translateY(-2px);
      color: white;
    }

    .action-card .material-icons {
      font-size: 32px;
      margin-bottom: 16px;
    }

    .action-card h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
    }

    .action-card p {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .admin-dashboard {
        padding: 10px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 1250,
    totalCourses: 45,
    totalQuizzes: 120,
    activeUsers: 890
  };

  recentActivity = [
    {
      icon: 'person_add',
      title: 'New User Registration',
      description: 'John Doe registered as a student',
      time: new Date()
    },
    {
      icon: 'school',
      title: 'Course Published',
      description: 'Advanced JavaScript course was published',
      time: new Date(Date.now() - 3600000)
    },
    {
      icon: 'quiz',
      title: 'Quiz Completed',
      description: '50 students completed the React Basics quiz',
      time: new Date(Date.now() - 7200000)
    },
    {
      icon: 'trending_up',
      title: 'Platform Growth',
      description: 'Monthly active users increased by 15%',
      time: new Date(Date.now() - 86400000)
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Load admin dashboard data
  }
} 