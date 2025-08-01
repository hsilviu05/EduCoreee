import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { Quiz } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-quiz-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="quiz-detail" *ngIf="quiz">
      <div class="quiz-header">
        <div class="quiz-info">
          <h1>{{ quiz.title }}</h1>
          <p class="quiz-description">{{ quiz.description }}</p>
          
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
        </div>
        
        <div class="quiz-actions">
          <button class="btn btn-primary" (click)="startQuiz()">
            Start Quiz
          </button>
          <button class="btn btn-outline" (click)="previewQuiz()">
            Preview Quiz
          </button>
        </div>
      </div>

      <div class="quiz-content">
        <div class="quiz-overview">
          <h2>Quiz Overview</h2>
          <div class="overview-grid">
            <div class="overview-item">
              <div class="overview-icon">
                <span class="material-icons">schedule</span>
              </div>
              <div class="overview-content">
                <h3>Time Limit</h3>
                <p>{{ quiz.timeLimit || 'No time limit' }} minutes</p>
              </div>
            </div>
            
            <div class="overview-item">
              <div class="overview-icon">
                <span class="material-icons">quiz</span>
              </div>
              <div class="overview-content">
                <h3>Questions</h3>
                <p>{{ quiz.questions?.length || 0 }} total questions</p>
              </div>
            </div>
            
            <div class="overview-item">
              <div class="overview-icon">
                <span class="material-icons">school</span>
              </div>
              <div class="overview-content">
                <h3>Passing Score</h3>
                <p>{{ quiz.passingScore }}% required to pass</p>
              </div>
            </div>
            
            <div class="overview-item">
              <div class="overview-icon">
                <span class="material-icons">attempts</span>
              </div>
              <div class="overview-content">
                <h3>Attempts</h3>
                <p>Unlimited attempts allowed</p>
              </div>
            </div>
          </div>
        </div>

        <div class="quiz-instructions">
          <h2>Instructions</h2>
          <div class="instructions-list">
            <div class="instruction-item">
              <span class="material-icons">check_circle</span>
              <p>Read each question carefully before answering</p>
            </div>
            <div class="instruction-item">
              <span class="material-icons">check_circle</span>
              <p>You can review and change your answers before submitting</p>
            </div>
            <div class="instruction-item">
              <span class="material-icons">check_circle</span>
              <p>Ensure you have a stable internet connection</p>
            </div>
            <div class="instruction-item">
              <span class="material-icons">check_circle</span>
              <p>Don't refresh the page during the quiz</p>
            </div>
          </div>
        </div>

        <div class="quiz-topics">
          <h2>Topics Covered</h2>
          <div class="topics-list">
            <div class="topic-item" *ngFor="let topic of quizTopics">
              <span class="material-icons">topic</span>
              <span>{{ topic }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quiz-sidebar">
        <div class="recent-attempts">
          <h3>Recent Attempts</h3>
          <div class="attempt-item" *ngFor="let attempt of recentAttempts">
            <div class="attempt-info">
              <h4>Attempt #{{ attempt.attemptNumber }}</h4>
              <p>{{ attempt.completedAt | date:'short' }}</p>
            </div>
            <div class="attempt-score">
              <span class="score" [class.passed]="attempt.passed" [class.failed]="!attempt.passed">
                {{ attempt.score }}%
              </span>
              <span class="status" [class.passed]="attempt.passed" [class.failed]="!attempt.passed">
                {{ attempt.passed ? 'Passed' : 'Failed' }}
              </span>
            </div>
          </div>
        </div>

        <div class="quiz-stats">
          <h3>Quiz Statistics</h3>
          <div class="stat-item">
            <span class="stat-label">Average Score</span>
            <span class="stat-value">{{ averageScore }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Pass Rate</span>
            <span class="stat-value">{{ passRate }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Attempts</span>
            <span class="stat-value">{{ totalAttempts }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-detail {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }

    .quiz-header {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      gap: 30px;
    }

    .quiz-info {
      flex: 1;
    }

    .quiz-info h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 32px;
    }

    .quiz-description {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .quiz-meta {
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

    .quiz-actions {
      flex-shrink: 0;
      display: flex;
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

    .quiz-content {
      display: grid;
      gap: 30px;
    }

    .quiz-overview,
    .quiz-instructions,
    .quiz-topics {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quiz-overview h2,
    .quiz-instructions h2,
    .quiz-topics h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .overview-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      background: #f8f9fa;
      transition: background-color 0.3s ease;
    }

    .overview-item:hover {
      background: #e9ecef;
    }

    .overview-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .overview-icon .material-icons {
      color: white;
      font-size: 20px;
    }

    .overview-content h3 {
      color: #2c3e50;
      margin: 0 0 4px 0;
      font-size: 16px;
    }

    .overview-content p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .instructions-list {
      display: grid;
      gap: 12px;
    }

    .instruction-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .instruction-item .material-icons {
      color: #27ae60;
      font-size: 20px;
    }

    .instruction-item p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .topics-list {
      display: grid;
      gap: 12px;
    }

    .topic-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .topic-item .material-icons {
      color: #667eea;
      font-size: 18px;
    }

    .topic-item span {
      color: #2c3e50;
      font-size: 14px;
    }

    .quiz-sidebar {
      display: grid;
      gap: 20px;
      align-content: start;
    }

    .recent-attempts,
    .quiz-stats {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .recent-attempts h3,
    .quiz-stats h3 {
      color: #2c3e50;
      margin-bottom: 16px;
      font-size: 18px;
    }

    .attempt-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e1e5e9;
    }

    .attempt-item:last-child {
      border-bottom: none;
    }

    .attempt-info h4 {
      color: #2c3e50;
      margin: 0 0 4px 0;
      font-size: 14px;
    }

    .attempt-info p {
      color: #666;
      margin: 0;
      font-size: 12px;
    }

    .attempt-score {
      text-align: right;
    }

    .score {
      display: block;
      font-weight: 600;
      font-size: 16px;
    }

    .score.passed {
      color: #27ae60;
    }

    .score.failed {
      color: #e74c3c;
    }

    .status {
      font-size: 12px;
    }

    .status.passed {
      color: #27ae60;
    }

    .status.failed {
      color: #e74c3c;
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
      .quiz-detail {
        grid-template-columns: 1fr;
        padding: 10px;
      }

      .quiz-header {
        flex-direction: column;
        align-items: stretch;
      }

      .quiz-actions {
        flex-direction: column;
      }

      .overview-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QuizDetailComponent implements OnInit {
  quiz: Quiz | null = null;
  quizTopics: string[] = [];
  recentAttempts: any[] = [];
  averageScore = 0;
  passRate = 0;
  totalAttempts = 0;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.loadQuiz(quizId);
    }
  }

  loadQuiz(quizId: string): void {
    // Mock data
    this.quiz = {
      id: quizId,
      courseId: '1',
      title: 'JavaScript Basics Quiz',
      description: 'Test your knowledge of JavaScript fundamentals including variables, functions, and basic programming concepts.',
      questions: [],
      timeLimit: 30,
      passingScore: 70,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.quizTopics = [
      'Variables and Data Types',
      'Functions and Scope',
      'Control Flow',
      'Arrays and Objects',
      'DOM Manipulation'
    ];

    this.recentAttempts = [
      {
        attemptNumber: 1,
        score: 85,
        passed: true,
        completedAt: new Date(Date.now() - 86400000)
      },
      {
        attemptNumber: 2,
        score: 92,
        passed: true,
        completedAt: new Date(Date.now() - 172800000)
      }
    ];

    this.averageScore = 78;
    this.passRate = 85;
    this.totalAttempts = 15;
  }

  startQuiz(): void {
    if (this.quiz) {
      console.log('Starting quiz:', this.quiz.id);
      // Navigate to quiz taker
    }
  }

  previewQuiz(): void {
    if (this.quiz) {
      console.log('Previewing quiz:', this.quiz.id);
      // Navigate to quiz preview
    }
  }
} 