import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Lesson } from '../../../core/models/course.model';

@Component({
  selector: 'app-lesson-viewer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="lesson-viewer" *ngIf="lesson">
      <div class="lesson-header">
        <div class="lesson-info">
          <h1>{{ lesson.title }}</h1>
          <p class="lesson-description">{{ lesson.description }}</p>
          <div class="lesson-meta">
            <span class="material-icons">schedule</span>
            <span>{{ lesson.duration }} min</span>
            <span class="lesson-number">Lesson {{ lesson.order }}</span>
          </div>
        </div>
        
        <div class="lesson-actions">
          <button class="btn btn-secondary" (click)="markAsComplete()" *ngIf="!isCompleted">
            Mark as Complete
          </button>
          <button class="btn btn-primary" (click)="markAsComplete()" *ngIf="isCompleted">
            <span class="material-icons">check_circle</span>
            Completed
          </button>
        </div>
      </div>

      <div class="lesson-content">
        <div class="video-section">
          <div class="video-container">
            <video 
              [src]="lesson.videoUrl" 
              controls 
              class="lesson-video"
              (loadedmetadata)="onVideoLoad()"
              (timeupdate)="onVideoProgress()"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div class="content-section">
          <div class="content-text">
            <h2>Lesson Content</h2>
            <div class="content-body" [innerHTML]="lesson.content"></div>
          </div>

          <div class="lesson-navigation">
            <button class="btn btn-outline" (click)="previousLesson()" [disabled]="!hasPreviousLesson">
              <span class="material-icons">arrow_back</span>
              Previous Lesson
            </button>
            <button class="btn btn-primary" (click)="nextLesson()" [disabled]="!hasNextLesson">
              Next Lesson
              <span class="material-icons">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <div class="lesson-sidebar">
        <div class="progress-card">
          <h3>Course Progress</h3>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="courseProgress"></div>
          </div>
          <p>{{ completedLessons }} of {{ totalLessons }} lessons completed</p>
        </div>

        <div class="lesson-list">
          <h3>Course Lessons</h3>
          <div class="lesson-item" *ngFor="let lessonItem of courseLessons">
            <div class="lesson-item-header">
              <span class="lesson-number">{{ lessonItem.order }}</span>
              <div class="lesson-item-info">
                <h4>{{ lessonItem.title }}</h4>
                <span class="lesson-duration">{{ lessonItem.duration }} min</span>
              </div>
              <div class="lesson-status">
                <span class="material-icons" *ngIf="lessonItem.isCompleted">check_circle</span>
                <span class="material-icons" *ngIf="!lessonItem.isCompleted">radio_button_unchecked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lesson-viewer {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }

    .lesson-header {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      gap: 20px;
    }

    .lesson-info {
      flex: 1;
    }

    .lesson-info h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 28px;
    }

    .lesson-description {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .lesson-meta {
      display: flex;
      align-items: center;
      gap: 20px;
      color: #666;
      font-size: 14px;
    }

    .lesson-meta .material-icons {
      font-size: 16px;
      color: #999;
    }

    .lesson-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .lesson-actions {
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
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-outline {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-outline:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .lesson-content {
      display: grid;
      gap: 30px;
    }

    .video-section {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .video-container {
      position: relative;
      width: 100%;
      background: #000;
    }

    .lesson-video {
      width: 100%;
      height: auto;
      display: block;
    }

    .content-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .content-text h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .content-body {
      color: #666;
      line-height: 1.6;
      font-size: 16px;
    }

    .lesson-navigation {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .lesson-sidebar {
      display: grid;
      gap: 20px;
      align-content: start;
    }

    .progress-card,
    .lesson-list {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .progress-card h3,
    .lesson-list h3 {
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

    .lesson-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .lesson-item {
      padding: 12px 0;
      border-bottom: 1px solid #e1e5e9;
    }

    .lesson-item:last-child {
      border-bottom: none;
    }

    .lesson-item-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .lesson-item-header .lesson-number {
      background: #f8f9fa;
      color: #666;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .lesson-item-info {
      flex: 1;
    }

    .lesson-item-info h4 {
      color: #2c3e50;
      margin: 0 0 4px 0;
      font-size: 14px;
    }

    .lesson-duration {
      color: #666;
      font-size: 12px;
    }

    .lesson-status .material-icons {
      color: #27ae60;
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .lesson-viewer {
        grid-template-columns: 1fr;
        padding: 10px;
      }

      .lesson-header {
        flex-direction: column;
        align-items: stretch;
      }

      .lesson-navigation {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class LessonViewerComponent implements OnInit {
  lesson: Lesson | null = null;
  courseLessons: Lesson[] = [];
  isCompleted = false;
  completedLessons = 0;
  totalLessons = 0;
  courseProgress = 0;
  hasPreviousLesson = false;
  hasNextLesson = true;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const lessonId = this.route.snapshot.paramMap.get('lessonId');
    if (lessonId) {
      this.loadLesson(lessonId);
    }
  }

  loadLesson(lessonId: string): void {
    // Mock data
    this.lesson = {
      id: lessonId,
      courseId: '1',
      title: 'Introduction to JavaScript',
      description: 'Learn what JavaScript is and how it works in web development.',
      content: `
        <h3>What is JavaScript?</h3>
        <p>JavaScript is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.</p>
        
        <h3>Key Features:</h3>
        <ul>
          <li>Dynamic typing</li>
          <li>Object-oriented programming</li>
          <li>Functional programming</li>
          <li>Event-driven programming</li>
        </ul>
        
        <h3>Why Learn JavaScript?</h3>
        <p>JavaScript is essential for modern web development and is used in both frontend and backend development.</p>
      `,
      videoUrl: 'https://example.com/video1.mp4',
      duration: 15,
      order: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.courseLessons = [
      {
        id: '1',
        courseId: '1',
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
        courseId: '1',
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

    this.totalLessons = this.courseLessons.length;
    this.completedLessons = 1; // Mock data
    this.courseProgress = (this.completedLessons / this.totalLessons) * 100;
  }

  onVideoLoad(): void {
    console.log('Video loaded');
  }

  onVideoProgress(): void {
    // Track video progress
    console.log('Video progress updated');
  }

  markAsComplete(): void {
    if (this.lesson) {
      this.courseService.completeLesson(this.lesson.id).subscribe({
        next: () => {
          this.isCompleted = true;
          console.log('Lesson marked as complete');
        },
        error: (error) => {
          console.error('Failed to mark lesson as complete:', error);
        }
      });
    }
  }

  previousLesson(): void {
    console.log('Navigate to previous lesson');
  }

  nextLesson(): void {
    console.log('Navigate to next lesson');
  }
} 