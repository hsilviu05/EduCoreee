import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics">
      <div class="header">
        <h1>Platform Analytics</h1>
        <p>Monitor platform performance and user engagement</p>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">trending_up</span>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalRevenue }}</h3>
            <p>Total Revenue</p>
            <span class="stat-change positive">+15% from last month</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">people</span>
          </div>
          <div class="stat-content">
            <h3>{{ stats.activeUsers }}</h3>
            <p>Active Users</p>
            <span class="stat-change positive">+8% from last week</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">school</span>
          </div>
          <div class="stat-content">
            <h3>{{ stats.courseCompletions }}</h3>
            <p>Course Completions</p>
            <span class="stat-change positive">+12% from last month</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">quiz</span>
          </div>
          <div class="stat-content">
            <h3>{{ stats.avgQuizScore }}%</h3>
            <p>Average Quiz Score</p>
            <span class="stat-change negative">-2% from last month</span>
          </div>
        </div>
      </div>

      <div class="analytics-content">
        <div class="section">
          <h2>User Growth</h2>
          <div class="chart-container">
            <div class="chart-placeholder">
              <span class="material-icons">show_chart</span>
              <p>User growth chart would be displayed here</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Top Performing Courses</h2>
          <div class="course-performance">
            <div class="performance-item" *ngFor="let course of topCourses">
              <div class="course-info">
                <h4>{{ course.title }}</h4>
                <p>{{ course.instructor }}</p>
              </div>
              <div class="performance-metrics">
                <div class="metric">
                  <span class="metric-value">{{ course.enrollments }}</span>
                  <span class="metric-label">Enrollments</span>
                </div>
                <div class="metric">
                  <span class="metric-value">{{ course.completionRate }}%</span>
                  <span class="metric-label">Completion Rate</span>
                </div>
                <div class="metric">
                  <span class="metric-value">{{ course.rating }}/5</span>
                  <span class="metric-label">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Recent Activity</h2>
          <div class="activity-timeline">
            <div class="timeline-item" *ngFor="let activity of recentActivity">
              <div class="timeline-icon">
                <span class="material-icons">{{ activity.icon }}</span>
              </div>
              <div class="timeline-content">
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.description }}</p>
                <span class="timeline-time">{{ activity.time | date:'short' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Geographic Distribution</h2>
          <div class="geo-stats">
            <div class="geo-item" *ngFor="let region of geographicData">
              <div class="region-info">
                <h4>{{ region.name }}</h4>
                <p>{{ region.users }} users</p>
              </div>
              <div class="region-percentage">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="region.percentage"></div>
                </div>
                <span class="percentage">{{ region.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 32px;
    }

    .header p {
      color: #666;
      font-size: 16px;
    }

    .stats-overview {
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
      margin: 0 0 8px 0;
      font-size: 14px;
    }

    .stat-change {
      font-size: 12px;
      font-weight: 500;
    }

    .stat-change.positive {
      color: #27ae60;
    }

    .stat-change.negative {
      color: #e74c3c;
    }

    .analytics-content {
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

    .chart-container {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .chart-placeholder {
      text-align: center;
      color: #666;
    }

    .chart-placeholder .material-icons {
      font-size: 48px;
      margin-bottom: 16px;
      color: #ccc;
    }

    .course-performance {
      display: grid;
      gap: 16px;
    }

    .performance-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      background: #f8f9fa;
      transition: background-color 0.3s ease;
    }

    .performance-item:hover {
      background: #e9ecef;
    }

    .course-info h4 {
      color: #2c3e50;
      margin: 0 0 4px 0;
      font-size: 16px;
    }

    .course-info p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .performance-metrics {
      display: flex;
      gap: 24px;
    }

    .metric {
      text-align: center;
    }

    .metric-value {
      display: block;
      color: #2c3e50;
      font-weight: 600;
      font-size: 18px;
    }

    .metric-label {
      color: #666;
      font-size: 12px;
    }

    .activity-timeline {
      display: grid;
      gap: 16px;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      background: #f8f9fa;
      transition: background-color 0.3s ease;
    }

    .timeline-item:hover {
      background: #e9ecef;
    }

    .timeline-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .timeline-icon .material-icons {
      color: white;
      font-size: 20px;
    }

    .timeline-content h4 {
      color: #2c3e50;
      margin: 0 0 4px 0;
      font-size: 16px;
    }

    .timeline-content p {
      color: #666;
      margin: 0 0 8px 0;
      font-size: 14px;
    }

    .timeline-time {
      color: #999;
      font-size: 12px;
    }

    .geo-stats {
      display: grid;
      gap: 16px;
    }

    .geo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .region-info h4 {
      color: #2c3e50;
      margin: 0 0 4px 0;
      font-size: 16px;
    }

    .region-info p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .region-percentage {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .progress-bar {
      width: 100px;
      height: 8px;
      background: #e1e5e9;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .percentage {
      color: #2c3e50;
      font-weight: 600;
      font-size: 14px;
      min-width: 40px;
    }

    @media (max-width: 768px) {
      .analytics {
        padding: 10px;
      }

      .stats-overview {
        grid-template-columns: 1fr;
      }

      .performance-metrics {
        flex-direction: column;
        gap: 12px;
      }

      .geo-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  stats = {
    totalRevenue: 15420,
    activeUsers: 1250,
    courseCompletions: 890,
    avgQuizScore: 78
  };

  topCourses = [
    {
      title: 'JavaScript Fundamentals',
      instructor: 'John Doe',
      enrollments: 450,
      completionRate: 85,
      rating: 4.8
    },
    {
      title: 'React Development',
      instructor: 'Jane Smith',
      enrollments: 320,
      completionRate: 78,
      rating: 4.6
    },
    {
      title: 'Python for Beginners',
      instructor: 'Mike Johnson',
      enrollments: 280,
      completionRate: 82,
      rating: 4.7
    }
  ];

  recentActivity = [
    {
      icon: 'person_add',
      title: 'New User Registration',
      description: '25 new users registered today',
      time: new Date()
    },
    {
      icon: 'school',
      title: 'Course Completion',
      description: '15 students completed JavaScript Fundamentals',
      time: new Date(Date.now() - 3600000)
    },
    {
      icon: 'quiz',
      title: 'Quiz Results',
      description: 'Average score improved by 5% this week',
      time: new Date(Date.now() - 7200000)
    }
  ];

  geographicData = [
    { name: 'North America', users: 450, percentage: 36 },
    { name: 'Europe', users: 380, percentage: 30 },
    { name: 'Asia', users: 280, percentage: 22 },
    { name: 'Other', users: 140, percentage: 12 }
  ];

  constructor() {}

  ngOnInit(): void {
    // Load analytics data
  }
} 