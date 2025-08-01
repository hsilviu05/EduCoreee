import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="course-list">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <h1>Browse Courses</h1>
          <p>Discover amazing courses from expert instructors</p>
        </div>
        
        <div class="search-filters">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Search courses..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              class="search-input"
            />
            <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          
          <select [(ngModel)]="selectedCategory" (change)="onCategoryChange()" class="category-filter">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">
              {{ category }}
            </option>
          </select>
          
          <select [(ngModel)]="selectedLevel" (change)="onLevelChange()" class="level-filter">
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <!-- Course Grid -->
      <div class="courses-container">
        <div class="courses-grid" *ngIf="filteredCourses.length > 0; else noCourses">
          <div class="course-card" *ngFor="let course of filteredCourses">
            <div class="course-image">
              <div class="course-image-placeholder" *ngIf="!course.thumbnail">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span class="placeholder-text">{{ course.title.charAt(0) }}</span>
              </div>
              <img *ngIf="course.thumbnail" [src]="course.thumbnail" [alt]="course.title">
              <div class="course-overlay">
                <button class="play-btn" [routerLink]="['/courses', course.id]">
                  <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <div class="course-badge" *ngIf="course.isPublished">
                <span class="badge published">Published</span>
              </div>
            </div>
            
            <div class="course-content">
              <div class="course-header">
                <h3>{{ course.title }}</h3>
                <div class="course-rating">
                  <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span>{{ course.rating }}/5</span>
                </div>
              </div>
              
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
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 9.5V22h6z"/>
                    <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
                  </svg>
                  <span>{{ course.enrolledStudents }} students</span>
                </div>
              </div>
              
              <div class="course-footer">
                <div class="course-level">
                  <span class="level-badge" [class]="'level-' + course.level.toLowerCase()">
                    {{ course.level }}
                  </span>
                </div>
                <div class="course-price">
                  <span class="price" *ngIf="course.price > 0">{{ course.price | currency }}</span>
                  <span class="price free" *ngIf="course.price === 0">Free</span>
                </div>
              </div>
              
              <button class="enroll-btn" (click)="enrollInCourse(course.id)">
                Enroll Now
              </button>
            </div>
          </div>
        </div>

        <ng-template #noCourses>
          <div class="empty-state">
            <span class="material-icons">search</span>
            <h3>No courses found</h3>
            <p>Try adjusting your search criteria or browse all courses.</p>
            <button class="btn btn-primary" (click)="clearFilters()">Clear Filters</button>
          </div>
        </ng-template>
      </div>

      <!-- Load More -->
      <div class="load-more" *ngIf="hasMoreCourses">
        <button class="btn btn-outline" (click)="loadMoreCourses()">
          Load More Courses
        </button>
      </div>
    </div>
  `,
  styles: [`
    .course-list {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 40px;
    }

    .header-content {
      margin-bottom: 30px;
    }

    .header-content h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 32px;
    }

    .header-content p {
      color: #666;
      font-size: 16px;
    }

    .search-filters {
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 300px;
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

    .category-filter,
    .level-filter {
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      background: white;
      min-width: 150px;
    }

    .courses-container {
      margin-bottom: 40px;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
    }

    .course-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .course-card:hover {
      transform: translateY(-4px);
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

    .course-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .course-card:hover .course-overlay {
      opacity: 1;
    }

    .play-btn {
      background: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .play-btn:hover {
      transform: scale(1.1);
    }

    .play-btn .material-icons {
      color: #667eea;
      font-size: 28px;
    }

    .course-badge {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge.published {
      background: #d4edda;
      color: #155724;
    }

    .course-content {
      padding: 20px;
    }

    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .course-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 18px;
      line-height: 1.3;
      flex: 1;
      margin-right: 10px;
    }

    .course-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #f39c12;
      font-size: 14px;
    }

    .course-description {
      color: #666;
      margin: 0 0 15px 0;
      font-size: 14px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
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

    .course-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .level-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .level-badge.level-beginner {
      background: #d1ecf1;
      color: #0c5460;
    }

    .level-badge.level-intermediate {
      background: #fff3cd;
      color: #856404;
    }

    .level-badge.level-advanced {
      background: #f8d7da;
      color: #721c24;
    }

    .course-price {
      font-weight: 600;
      font-size: 18px;
    }

    .price {
      color: #2c3e50;
    }

    .price.free {
      color: #27ae60;
    }

    .enroll-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .enroll-btn:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
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

    .load-more {
      text-align: center;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
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

    .play-icon {
      width: 28px;
      height: 28px;
      color: #667eea;
    }

    .star-icon {
      width: 16px;
      height: 16px;
      color: #f39c12;
    }

    .meta-icon {
      width: 16px;
      height: 16px;
      color: #666;
    }

    @media (max-width: 768px) {
      .search-filters {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        min-width: auto;
      }

      .courses-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchQuery = '';
  selectedCategory = '';
  selectedLevel = '';
  categories: string[] = [];
  hasMoreCourses = false;
  currentPage = 1;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.filteredCourses = courses;
      this.extractCategories();
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onLevelChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = !this.searchQuery || 
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || course.category === this.selectedCategory;
      const matchesLevel = !this.selectedLevel || course.level === this.selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.courses.map(course => course.category));
    this.categories = Array.from(categorySet).sort();
  }

  enrollInCourse(courseId: string): void {
    this.courseService.enrollInCourse(courseId).subscribe({
      next: () => {
        // Show success message or redirect
        console.log('Successfully enrolled in course');
      },
      error: (error) => {
        console.error('Failed to enroll in course:', error);
      }
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedLevel = '';
    this.filteredCourses = this.courses;
  }

  loadMoreCourses(): void {
    // Implement pagination logic
    this.currentPage++;
    // Load more courses from API
  }
} 