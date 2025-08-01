import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { QuizService } from '../../core/services/quiz.service';
import { AuthService } from '../../core/services/auth.service';
import { Course, CourseProgress } from '../../core/models/course.model';
import { QuizAttempt } from '../../core/models/quiz.model';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h1 class="welcome-title">Welcome back, {{ currentUser?.firstName || 'User' }}!</h1>
        <p class="welcome-subtitle">Here's what's happening with your EduCore learning journey today.</p>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.enrolledCourses }}</h3>
            <p class="stat-label">Enrolled Courses</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.completedLessons }}</h3>
            <p class="stat-label">Completed Lessons</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-2.4-.4-3.5-1.5-2.5-2.4-6.5-2.4-9 0C7.4 11.6 6 12 5 12"/>
              <path d="M3 3v18h18"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.quizAttempts }}</h3>
            <p class="stat-label">Quiz Attempts</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L6 14.3"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.averageScore }}%</h3>
            <p class="stat-label">Average Score</p>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Recent Courses Section -->
        <div class="content-section">
          <div class="section-header">
            <h2 class="section-title">Recent Courses</h2>
            <a routerLink="/courses" class="view-all-link">View All</a>
          </div>
          
          <div class="empty-state" *ngIf="recentCourses.length === 0">
            <div class="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h3 class="empty-title">No courses yet</h3>
            <p class="empty-description">Start your EduCore learning journey by enrolling in a course.</p>
            <a routerLink="/courses" class="btn btn-primary btn-lg">Browse Courses</a>
          </div>

          <div class="courses-grid" *ngIf="recentCourses.length > 0">
            <div class="course-card" *ngFor="let course of recentCourses">
              <div class="course-header">
                <h3 class="course-title">{{ course.title }}</h3>
                <span class="course-status" [class.completed]="getCourseProgress(course.id)?.completedAt">
                  {{ getCourseProgress(course.id)?.completedAt ? 'Completed' : 'In Progress' }}
                </span>
              </div>
              <p class="course-description">{{ course.description }}</p>
              <div class="course-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="getProgressPercentage(course.id)"></div>
                </div>
                <span class="progress-text">{{ getProgressPercentage(course.id) }}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div class="content-section">
          <div class="section-header">
            <h2 class="section-title">Quick Actions</h2>
          </div>
          
          <div class="actions-grid">
            <a routerLink="/courses" class="action-card">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <h3 class="action-title">Browse Courses</h3>
              <p class="action-description">Discover new courses to expand your EduCore knowledge</p>
            </a>

            <a routerLink="/quiz" class="action-card">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-2.4-.4-3.5-1.5-2.5-2.4-6.5-2.4-9 0C7.4 11.6 6 12 5 12"/>
                  <path d="M3 3v18h18"/>
                </svg>
              </div>
              <h3 class="action-title">Take Quiz</h3>
              <p class="action-description">Test your EduCore knowledge with interactive quizzes</p>
            </a>

            <a routerLink="/profile" class="action-card">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 class="action-title">Update Profile</h3>
              <p class="action-description">Keep your EduCore profile information up to date</p>
            </a>

            <a routerLink="/settings" class="action-card">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <h3 class="action-title">Settings</h3>
              <p class="action-description">Customize your EduCore learning experience</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: var(--spacing-xl);
      max-width: 1400px;
      margin: 0 auto;
      transition: all var(--transition-normal);
    }

    /* Welcome Section */
    .welcome-section {
      margin-bottom: var(--spacing-2xl);
      text-align: center;
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transition: color var(--transition-normal);
    }

    .welcome-subtitle {
      color: var(--text-secondary);
      font-size: 1.125rem;
      margin: 0;
      transition: color var(--transition-normal);
    }

    /* Statistics Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--gray-200);
      transition: all var(--transition-normal);
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
      flex-shrink: 0;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-xs) 0;
      transition: color var(--transition-normal);
    }

    .stat-label {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color var(--transition-normal);
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--spacing-2xl);
    }

    /* Section Styles */
    .content-section {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      border: 1px solid var(--gray-200);
      transition: all var(--transition-normal);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      transition: color var(--transition-normal);
    }

    .view-all-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: color var(--transition-fast);
    }

    .view-all-link:hover {
      color: var(--primary-dark);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: var(--spacing-2xl) var(--spacing-xl);
    }

    .empty-icon {
      margin-bottom: var(--spacing-lg);
      color: var(--text-muted);
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-sm) 0;
      transition: color var(--transition-normal);
    }

    .empty-description {
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-lg) 0;
      transition: color var(--transition-normal);
    }

    /* Course Cards */
    .courses-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .course-card {
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      padding: var(--spacing-lg);
      border: 1px solid var(--gray-200);
      transition: all var(--transition-normal);
    }

    .course-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-md);
    }

    .course-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      transition: color var(--transition-normal);
    }

    .course-status {
      font-size: 0.75rem;
      font-weight: 500;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      background: var(--gray-100);
      color: var(--text-secondary);
      transition: all var(--transition-normal);
    }

    .course-status.completed {
      background: var(--success-color);
      color: var(--text-inverse);
    }

    .course-description {
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-md) 0;
      font-size: 0.875rem;
      line-height: 1.5;
      transition: color var(--transition-normal);
    }

    .course-progress {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: var(--gray-200);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      border-radius: var(--radius-sm);
      transition: width var(--transition-normal);
    }

    .progress-text {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
      transition: color var(--transition-normal);
    }

    /* Quick Actions */
    .actions-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .action-card {
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      padding: var(--spacing-lg);
      text-decoration: none;
      border: 1px solid var(--gray-200);
      transition: all var(--transition-normal);
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
      flex-shrink: 0;
    }

    .action-content {
      flex: 1;
    }

    .action-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-xs) 0;
      transition: color var(--transition-normal);
    }

    .action-description {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.5;
      transition: color var(--transition-normal);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .content-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-xl);
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: var(--spacing-lg);
      }

      .welcome-title {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }

      .content-section {
        padding: var(--spacing-lg);
      }
    }

    @media (max-width: 480px) {
      .dashboard-container {
        padding: var(--spacing-md);
      }

      .welcome-title {
        font-size: 1.75rem;
      }

      .stat-card {
        padding: var(--spacing-lg);
      }

      .action-card {
        padding: var(--spacing-md);
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  recentCourses: Course[] = [];
  recentQuizAttempts: QuizAttempt[] = [];
  courseProgresses: CourseProgress[] = [];

  stats = {
    enrolledCourses: 0,
    completedLessons: 5,
    quizAttempts: 0,
    averageScore: 0
  };

  constructor(
    private courseService: CourseService,
    private quizService: QuizService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadDashboardData();
  }

  private loadUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadDashboardData(): void {
    // Load recent courses
    this.courseService.getCourses().subscribe(courses => {
      this.recentCourses = courses.slice(0, 3);
      this.stats.enrolledCourses = courses.length;
    });

    // Load quiz attempts
    this.quizService.getQuizAttempts('all').subscribe((attempts: QuizAttempt[]) => {
      this.recentQuizAttempts = attempts.slice(0, 5);
      this.stats.quizAttempts = attempts.length;
      
      if (attempts.length > 0) {
        const totalScore = attempts.reduce((sum: number, attempt: QuizAttempt) => sum + (attempt.score || 0), 0);
        this.stats.averageScore = Math.round(totalScore / attempts.length);
      }
    });

    // Load course progress
    this.loadMockProgress();
  }

  getCourseProgress(courseId: string): CourseProgress | undefined {
    return this.courseProgresses.find(progress => progress.courseId === courseId);
  }

  getProgressPercentage(courseId: string): number {
    const progress = this.getCourseProgress(courseId);
    return progress ? progress.progress : 0;
  }

  private loadMockProgress(): void {
    // Mock data for demonstration
    this.courseProgresses = [
      {
        id: '1',
        userId: 'user1',
        courseId: 'course1',
        completedLessons: ['lesson1', 'lesson2', 'lesson3'],
        currentLessonId: 'lesson2',
        progress: 30,
        startedAt: new Date(),
        lastAccessedAt: new Date()
      }
    ];
  }
} 