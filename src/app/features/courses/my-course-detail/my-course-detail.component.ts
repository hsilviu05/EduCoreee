import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course, Lesson, CourseProgress } from '../../../core/models/course.model';

@Component({
  selector: 'app-my-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-course-detail" *ngIf="course">
      <div class="course-header">
        <div class="course-info">
          <h1>{{ course.title }}</h1>
          <p class="course-description">{{ course.description }}</p>
          
          <div class="course-meta">
            <div class="meta-item">
              <span class="material-icons">person</span>
              <span>{{ course.instructorName }}</span>
            </div>
            <div class="meta-item">
              <span class="material-icons">schedule</span>
              <span>{{ course.duration }} min</span>
            </div>
            <div class="meta-item">
              <span class="material-icons">school</span>
              <span>{{ getCompletedLessons() }}/{{ lessons.length }} lessons</span>
            </div>
          </div>
        </div>
        
        <div class="course-progress">
          <div class="progress-circle">
            <div class="progress-fill" [style.transform]="'rotate(' + (courseProgress?.progress || 0) * 3.6 + 'deg)'"></div>
            <div class="progress-text">{{ courseProgress?.progress || 0 }}%</div>
          </div>
          <p class="progress-label">Course Progress</p>
        </div>
      </div>

      <div class="course-content">
        <div class="lessons-section">
          <h2>Course Content</h2>
          <div class="lessons-list">
            <div class="lesson-item" *ngFor="let lesson of lessons; let i = index">
              <div class="lesson-header">
                <div class="lesson-number">{{ i + 1 }}</div>
                <div class="lesson-info">
                  <h3>{{ lesson.title }}</h3>
                  <p>{{ lesson.description }}</p>
                  <div class="lesson-meta">
                    <span class="material-icons">schedule</span>
                    <span>{{ lesson.duration }} min</span>
                  </div>
                </div>
                <div class="lesson-status">
                  <span class="material-icons" *ngIf="isLessonCompleted(lesson.id)">check_circle</span>
                  <span class="material-icons" *ngIf="!isLessonCompleted(lesson.id)">radio_button_unchecked</span>
                </div>
              </div>
              
              <div class="lesson-actions">
                <button class="btn btn-primary" [routerLink]="['/my-courses', course.id, 'lesson', lesson.id]" *ngIf="!isLessonCompleted(lesson.id)">
                  Start Lesson
                </button>
                <button class="btn btn-outline" [routerLink]="['/my-courses', course.id, 'lesson', lesson.id]" *ngIf="isLessonCompleted(lesson.id)">
                  Review Lesson
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="course-sidebar">
          <div class="progress-card">
            <h3>Your Progress</h3>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="courseProgress?.progress || 0"></div>
            </div>
            <p>{{ getCompletedLessons() }} of {{ lessons.length }} lessons completed</p>
          </div>

          <div class="course-stats">
            <h3>Course Statistics</h3>
            <div class="stat-item">
              <span class="stat-label">Total Lessons</span>
              <span class="stat-value">{{ lessons.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Completed</span>
              <span class="stat-value">{{ getCompletedLessons() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Remaining</span>
              <span class="stat-value">{{ lessons.length - getCompletedLessons() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Time Spent</span>
              <span class="stat-value">{{ getTimeSpent() }} min</span>
            </div>
          </div>

          <div class="course-actions">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
              <button class="btn btn-primary" (click)="continueLearning()">
                <span class="material-icons">play_arrow</span>
                Continue Learning
              </button>
              
              <button class="btn btn-outline" (click)="downloadCertificate()" *ngIf="courseProgress?.progress === 100">
                <span class="material-icons">download</span>
                Download Certificate
              </button>
              
              <button class="btn btn-outline" (click)="shareProgress()">
                <span class="material-icons">share</span>
                Share Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-course-detail {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      gap: 30px;
    }

    .course-info {
      flex: 1;
    }

    .course-info h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 32px;
    }

    .course-description {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .course-meta {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .meta-item .material-icons {
      font-size: 16px;
      color: #999;
    }

    .course-progress {
      flex-shrink: 0;
      text-align: center;
    }

    .progress-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255,255,255,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 0 auto 12px;
      border: 8px solid #e1e5e9;
    }

    .progress-circle::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 8px;
      right: 8px;
      bottom: 8px;
      border-radius: 50%;
      background: #e1e5e9;
    }

    .progress-fill {
      position: absolute;
      top: 8px;
      left: 8px;
      right: 8px;
      bottom: 8px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%);
      transform-origin: center;
    }

    .progress-text {
      font-size: 24px;
      font-weight: 700;
      color: #2c3e50;
      z-index: 1;
    }

    .progress-label {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    .course-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }

    .lessons-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .lessons-section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .lessons-list {
      display: grid;
      gap: 16px;
    }

    .lesson-item {
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      padding: 16px;
      transition: border-color 0.3s ease;
    }

    .lesson-item:hover {
      border-color: #667eea;
    }

    .lesson-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .lesson-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
    }

    .lesson-info {
      flex: 1;
    }

    .lesson-info h3 {
      color: #2c3e50;
      margin: 0 0 5px 0;
      font-size: 16px;
    }

    .lesson-info p {
      color: #666;
      margin: 0 0 8px 0;
      font-size: 14px;
    }

    .lesson-meta {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 12px;
    }

    .lesson-status .material-icons {
      color: #27ae60;
      font-size: 20px;
    }

    .lesson-actions {
      display: flex;
      gap: 8px;
    }

    .course-sidebar {
      display: grid;
      gap: 20px;
    }

    .progress-card,
    .course-stats,
    .course-actions {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .progress-card h3,
    .course-stats h3,
    .course-actions h3 {
      color: #2c3e50;
      margin-bottom: 16px;
      font-size: 18px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e1e5e9;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-card p {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e1e5e9;
    }

    .stat-item:last-child {
      border-bottom: none;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .stat-value {
      color: #2c3e50;
      font-weight: 600;
      font-size: 14px;
    }

    .action-buttons {
      display: grid;
      gap: 12px;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }

    .btn-outline {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    @media (max-width: 768px) {
      .my-course-detail {
        padding: 10px;
      }

      .course-header {
        flex-direction: column;
        align-items: stretch;
      }

      .course-content {
        grid-template-columns: 1fr;
      }

      .course-meta {
        flex-direction: column;
        gap: 12px;
      }

      .lesson-actions {
        flex-direction: column;
      }
    }
  `]
})
export class MyCourseDetailComponent implements OnInit {
  course: Course | null = null;
  lessons: Lesson[] = [];
  courseProgress: CourseProgress | null = null;
  completedLessons: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourse(courseId);
    }
  }

  loadCourse(courseId: string): void {
    // Mock data
    this.course = {
      id: courseId,
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming with hands-on exercises and real-world projects.',
      instructorId: 'instructor-1',
      instructorName: 'John Doe',
      duration: 120,
      enrolledStudents: 150,
      rating: 4.8,
      category: 'programming',
      level: 'Beginner',
      lessons: [],
      price: 29.99,
      isPublished: true,
      thumbnail: 'assets/course-1.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.lessons = [
      {
        id: '1',
        courseId: courseId,
        title: 'Introduction to JavaScript',
        description: 'Learn what JavaScript is and how it works',
        content: 'JavaScript is a programming language...',
        videoUrl: 'https://example.com/video1.mp4',
        duration: 15,
        order: 1,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        courseId: courseId,
        title: 'Variables and Data Types',
        description: 'Understanding variables and different data types',
        content: 'Variables are containers for storing data...',
        videoUrl: 'https://example.com/video2.mp4',
        duration: 20,
        order: 2,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        courseId: courseId,
        title: 'Functions and Scope',
        description: 'Learn about functions and variable scope',
        content: 'Functions are reusable blocks of code...',
        videoUrl: 'https://example.com/video3.mp4',
        duration: 25,
        order: 3,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.courseProgress = {
      id: '1',
      userId: 'user1',
      courseId: courseId,
      currentLessonId: '2',
      completedLessons: ['1'],
      progress: 60,
      startedAt: new Date('2024-01-15'),
      lastAccessedAt: new Date('2024-01-20'),
      completedAt: undefined
    };

    // Mock completed lessons
    this.completedLessons.add('1');
  }

  getCompletedLessons(): number {
    return this.completedLessons.size;
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.completedLessons.has(lessonId);
  }

  getTimeSpent(): number {
    // Mock time spent calculation
    return this.getCompletedLessons() * 15; // 15 minutes per lesson
  }

  continueLearning(): void {
    // Find the next incomplete lesson
    const nextLesson = this.lessons.find(lesson => !this.isLessonCompleted(lesson.id));
    if (nextLesson) {
      console.log('Continuing with lesson:', nextLesson.id);
      // Navigate to lesson viewer
    }
  }

  downloadCertificate(): void {
    console.log('Downloading certificate');
    // Implement certificate download
  }

  shareProgress(): void {
    console.log('Sharing progress');
    // Implement share functionality
  }
} 