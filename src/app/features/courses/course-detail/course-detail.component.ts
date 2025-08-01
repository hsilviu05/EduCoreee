import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course, Lesson } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="course-detail" *ngIf="course">
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
              <span class="material-icons">group</span>
              <span>{{ course.enrolledStudents }} students</span>
            </div>
            <div class="meta-item">
              <span class="material-icons">star</span>
              <span>{{ course.rating }}/5</span>
            </div>
          </div>
        </div>
        
        <div class="course-actions">
          <button class="btn btn-primary" (click)="enrollInCourse()" *ngIf="!isEnrolled">
            Enroll Now
          </button>
          <button class="btn btn-secondary" (click)="continueLearning()" *ngIf="isEnrolled">
            Continue Learning
          </button>
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
                  <span class="material-icons" *ngIf="lesson.isCompleted">check_circle</span>
                  <span class="material-icons" *ngIf="!lesson.isCompleted">radio_button_unchecked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="course-sidebar">
          <div class="progress-card">
            <h3>Your Progress</h3>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progressPercentage"></div>
            </div>
            <p>{{ completedLessons }} of {{ totalLessons }} lessons completed</p>
          </div>

          <div class="course-stats">
            <h3>Course Statistics</h3>
            <div class="stat-item">
              <span class="stat-label">Total Lessons</span>
              <span class="stat-value">{{ totalLessons }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Duration</span>
              <span class="stat-value">{{ course.duration }} min</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Enrolled Students</span>
              <span class="stat-value">{{ course.enrolledStudents }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .course-detail {
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

    .course-actions {
      flex-shrink: 0;
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

    .btn-primary:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
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

    .course-sidebar {
      display: grid;
      gap: 20px;
    }

    .progress-card,
    .course-stats {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .progress-card h3,
    .course-stats h3 {
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

    @media (max-width: 768px) {
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
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  lessons: Lesson[] = [];
  isEnrolled = false;
  completedLessons = 0;
  totalLessons = 0;
  progressPercentage = 0;

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
      }
    ];

    this.totalLessons = this.lessons.length;
    this.completedLessons = 1; // Mock data
    this.progressPercentage = (this.completedLessons / this.totalLessons) * 100;
  }

  enrollInCourse(): void {
    if (this.course) {
      this.courseService.enrollInCourse(this.course.id).subscribe({
        next: () => {
          this.isEnrolled = true;
          console.log('Successfully enrolled in course');
        },
        error: (error) => {
          console.error('Failed to enroll in course:', error);
        }
      });
    }
  }

  continueLearning(): void {
    // Navigate to the next incomplete lesson
    console.log('Continue learning');
  }
} 