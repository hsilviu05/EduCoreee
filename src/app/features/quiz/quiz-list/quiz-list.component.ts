import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../../core/services/quiz.service';
import { Quiz } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="quiz-list">
      <div class="header">
        <h1>Available Quizzes</h1>
        <p>Test your knowledge with interactive quizzes</p>
      </div>

      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search quizzes..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            class="search-input"
          />
          <span class="material-icons search-icon">search</span>
        </div>
        
        <select [(ngModel)]="selectedCourse" (change)="onCourseFilter()" class="course-filter">
          <option value="">All Courses</option>
          <option *ngFor="let course of courses" [value]="course.id">
            {{ course.title }}
          </option>
        </select>
        
        <select [(ngModel)]="selectedDifficulty" (change)="onDifficultyFilter()" class="difficulty-filter">
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div class="quizzes-grid">
        <div class="quiz-card" *ngFor="let quiz of filteredQuizzes">
          <div class="quiz-header">
            <div class="quiz-info">
              <h3>{{ quiz.title }}</h3>
              <p class="quiz-description">{{ quiz.description }}</p>
            </div>
            <div class="quiz-status">
              <span class="status-badge" [class]="'status-' + quiz.isPublished">
                {{ quiz.isPublished ? 'Available' : 'Draft' }}
              </span>
            </div>
          </div>
          
          <div class="quiz-meta">
            <div class="meta-item">
              <span class="material-icons">schedule</span>
              <span>{{ quiz.timeLimit || 'No limit' }} min</span>
            </div>
            <div class="meta-item">
              <span class="material-icons">quiz</span>
              <span>{{ quiz.questions?.length || 0 }} questions</span>
            </div>
            <div class="meta-item">
              <span class="material-icons">school</span>
              <span>{{ quiz.passingScore }}% to pass</span>
            </div>
          </div>
          
          <div class="quiz-actions">
            <button class="btn btn-primary" [routerLink]="['/quiz', quiz.id]">
              Start Quiz
            </button>
            <button class="btn btn-outline" [routerLink]="['/quiz', quiz.id, 'preview']">
              Preview
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredQuizzes.length === 0">
        <span class="material-icons">quiz</span>
        <h3>No quizzes found</h3>
        <p>Try adjusting your search criteria or browse all quizzes.</p>
        <button class="btn btn-primary" (click)="clearFilters()">Clear Filters</button>
      </div>
    </div>
  `,
  styles: [`
    .quiz-list {
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
    }

    .course-filter,
    .difficulty-filter {
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      background: white;
      min-width: 150px;
    }

    .quizzes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .quiz-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .quiz-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .quiz-info h3 {
      color: #2c3e50;
      margin: 0 0 8px 0;
      font-size: 18px;
    }

    .quiz-description {
      color: #666;
      margin: 0;
      font-size: 14px;
      line-height: 1.4;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.status-true {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.status-false {
      background: #f8d7da;
      color: #721c24;
    }

    .quiz-meta {
      margin-bottom: 20px;
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

    .quiz-actions {
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

    @media (max-width: 768px) {
      .quiz-list {
        padding: 10px;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .quizzes-grid {
        grid-template-columns: 1fr;
      }

      .quiz-actions {
        flex-direction: column;
      }
    }
  `]
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  courses: any[] = [];
  searchQuery = '';
  selectedCourse = '';
  selectedDifficulty = '';

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadQuizzes();
    this.loadCourses();
  }

  loadQuizzes(): void {
    // Mock data
    this.quizzes = [
      {
        id: '1',
        courseId: '1',
        title: 'JavaScript Basics Quiz',
        description: 'Test your knowledge of JavaScript fundamentals',
        questions: [],
        timeLimit: 30,
        passingScore: 70,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        courseId: '1',
        title: 'Advanced JavaScript Quiz',
        description: 'Challenge yourself with advanced JavaScript concepts',
        questions: [],
        timeLimit: 45,
        passingScore: 80,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.filteredQuizzes = this.quizzes;
  }

  loadCourses(): void {
    // Mock data
    this.courses = [
      { id: '1', title: 'JavaScript Fundamentals' },
      { id: '2', title: 'React Development' }
    ];
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCourseFilter(): void {
    this.applyFilters();
  }

  onDifficultyFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredQuizzes = this.quizzes.filter(quiz => {
      const matchesSearch = !this.searchQuery || 
        quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCourse = !this.selectedCourse || quiz.courseId === this.selectedCourse;
      
      return matchesSearch && matchesCourse;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCourse = '';
    this.selectedDifficulty = '';
    this.filteredQuizzes = this.quizzes;
  }
} 