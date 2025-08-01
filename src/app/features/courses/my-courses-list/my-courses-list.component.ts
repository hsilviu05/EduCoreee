import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { Course, CourseProgress } from '../../../core/models/course.model';

@Component({
  selector: 'app-my-courses-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="my-courses">
      <div class="header">
        <h1>My Courses</h1>
        <p>Continue your learning journey</p>
      </div>

      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search my courses..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            class="search-input"
          />
          <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        
        <select [(ngModel)]="selectedStatus" (change)="onStatusFilter()" class="status-filter">
          <option value="">All Status</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="not-started">Not Started</option>
        </select>
      </div>

      <div class="courses-grid">
        <div class="course-card" *ngFor="let course of filteredCourses">
          <div class="course-image">
            <div class="course-image-placeholder" *ngIf="!course.thumbnail">
              <svg class="placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span class="placeholder-text">{{ course.title.charAt(0) }}</span>
            </div>
            <img *ngIf="course.thumbnail" [src]="course.thumbnail" [alt]="course.title">
            <div class="progress-overlay">
              <div class="progress-circle">
                <div class="progress-fill" [style.transform]="'rotate(' + (getProgress(course.id) * 3.6) + 'deg)'"></div>
                <div class="progress-text">{{ getProgress(course.id) }}%</div>
              </div>
            </div>
            <div class="course-status" [class]="'status-' + getCourseStatus(course.id)">
              {{ getCourseStatusLabel(course.id) }}
            </div>
          </div>
          
          <div class="course-content">
            <h3>{{ course.title }}</h3>
            <p class="course-description">{{ course.description }}</p>
            
            <div class="course-meta">
              <div class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>{{ course.instructorName }}</span>
              </div>
              <div class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span>{{ course.duration }} min</span>
              </div>
              <div class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                </svg>
                <span>{{ getCompletedLessons(course.id) }}/{{ getTotalLessons(course.id) }} lessons</span>
              </div>
            </div>
            
            <div class="course-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getProgress(course.id)"></div>
              </div>
              <span class="progress-text">{{ getProgress(course.id) }}% Complete</span>
            </div>
            
            <div class="course-actions">
              <button class="btn btn-primary" [routerLink]="['/my-courses', course.id]">
                Continue Learning
              </button>
              <button class="btn btn-outline" [routerLink]="['/courses', course.id]">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredCourses.length === 0">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>
        <h3>No courses found</h3>
        <p>You haven't enrolled in any courses yet. Start your learning journey!</p>
        <button class="btn btn-primary" routerLink="/courses">Browse Courses</button>
      </div>
    </div>
  `,
  styles: [`
    .my-courses {
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

    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      align-items: center;
    }

    .search-box {
      position: relative;
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 45px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .search-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      width: 20px;
      height: 20px;
    }

    .status-filter {
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      background: white;
      min-width: 150px;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .course-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .course-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .course-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .course-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-image-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .placeholder-icon {
      width: 60px;
      height: 60px;
      color: rgba(255, 255, 255, 0.3);
    }

    .placeholder-text {
      position: absolute;
      font-size: 48px;
      font-weight: bold;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .progress-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
    }

    .progress-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255,255,255,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .progress-circle::before {
      content: '';
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      border-radius: 50%;
      background: #e1e5e9;
    }

    .progress-fill {
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%);
      transform-origin: center;
    }

    .progress-text {
      font-size: 12px;
      font-weight: 600;
      color: #2c3e50;
      z-index: 1;
    }

    .course-status {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .course-status.status-in-progress {
      background: #fff3cd;
      color: #856404;
    }

    .course-status.status-completed {
      background: #d4edda;
      color: #155724;
    }

    .course-status.status-not-started {
      background: #f8d7da;
      color: #721c24;
    }

    .course-content {
      padding: 20px;
    }

    .course-content h3 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 18px;
    }

    .course-description {
      color: #666;
      margin: 0 0 15px 0;
      font-size: 14px;
      line-height: 1.4;
    }

    .course-meta {
      margin-bottom: 15px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #666;
    }

    .meta-item .material-icons {
      font-size: 16px;
      color: #999;
    }

    .meta-icon {
      width: 16px;
      height: 16px;
      color: #666;
    }

    .course-progress {
      margin-bottom: 15px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e1e5e9;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-bar .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      color: #666;
      font-size: 12px;
    }

    .course-actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
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

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .empty-state .material-icons {
      font-size: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #666;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 20px;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .my-courses {
        padding: 10px;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .courses-grid {
        grid-template-columns: 1fr;
      }

      .course-actions {
        flex-direction: column;
      }
    }
  `]
})
export class MyCoursesListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  courseProgresses: Map<string, CourseProgress> = new Map();
  searchQuery = '';
  selectedStatus = '';
  categories: string[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadMyCourses();
  }

  loadMyCourses(): void {
    this.courseService.getEnrolledCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filteredCourses = courses;
        this.extractCategories();
      },
      error: (error) => {
        console.error('Error loading enrolled courses:', error);
        // Fallback to mock data if API fails
        this.courses = [
          {
            id: '1',
            title: 'JavaScript Fun',
            description: 'Learn the basics of JavaScript programming with fun examples',
            instructorId: 'instructor1',
            instructorName: 'John Doe',
            category: 'Programming',
            level: 'Beginner',
            duration: 120,
            thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop',
            lessons: [],
            enrolledStudents: 45,
            rating: 4.5,
            price: 0,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            title: 'React Development',
            description: 'Master React with advanced concepts and real-world projects',
            instructorId: 'instructor2',
            instructorName: 'Jane Smith',
            category: 'Web Development',
            level: 'Intermediate',
            duration: 180,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
            lessons: [],
            enrolledStudents: 32,
            rating: 4.8,
            price: 0,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        this.filteredCourses = this.courses;
        this.extractCategories();
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = !this.searchQuery || 
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = !this.selectedStatus || 
        this.getCourseStatus(course.id) === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  extractCategories(): void {
    this.categories = [...new Set(this.courses.map(course => course.category))];
  }

  getProgress(courseId: string): number {
    const progress = this.courseProgresses.get(courseId);
    return progress ? progress.progress : 0;
  }

  getCourseStatus(courseId: string): string {
    const progress = this.getProgress(courseId);
    if (progress === 0) return 'not-started';
    if (progress === 100) return 'completed';
    return 'in-progress';
  }

  getCourseStatusLabel(courseId: string): string {
    const status = this.getCourseStatus(courseId);
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  }

  getCompletedLessons(courseId: string): number {
    // Mock data - in real app, this would come from the backend
    const progress = this.getProgress(courseId);
    const totalLessons = 10; // Mock total lessons
    return Math.floor((progress / 100) * totalLessons);
  }

  getTotalLessons(courseId: string): number {
    // Mock data - in real app, this would come from the backend
    return 10;
  }
} 