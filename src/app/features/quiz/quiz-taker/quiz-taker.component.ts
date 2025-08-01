import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../../core/services/quiz.service';
import { Quiz, Question, QuestionType } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-quiz-taker',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="quiz-taker" *ngIf="quiz">
      <div class="quiz-header">
        <div class="quiz-info">
          <h1>{{ quiz.title }}</h1>
          <div class="quiz-progress">
            <span>Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions?.length }}</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progressPercentage"></div>
            </div>
          </div>
        </div>
        
        <div class="quiz-timer" *ngIf="quiz.timeLimit">
          <span class="material-icons">schedule</span>
          <span class="timer">{{ formatTime(timeRemaining) }}</span>
        </div>
      </div>

      <div class="quiz-content">
        <div class="question-container" *ngIf="currentQuestion">
          <div class="question-header">
            <h2>Question {{ currentQuestionIndex + 1 }}</h2>
            <div class="question-meta">
              <span class="question-type">{{ getQuestionTypeLabel(currentQuestion.type) }}</span>
              <span class="question-points">{{ currentQuestion.points }} points</span>
            </div>
          </div>

          <div class="question-content">
            <p class="question-text">{{ currentQuestion.text }}</p>
            
            <div class="question-options" *ngIf="currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'single_choice'">
              <div class="option-item" *ngFor="let option of currentQuestion.options; let i = index">
                <input 
                  [type]="currentQuestion.type === 'multiple_choice' ? 'checkbox' : 'radio'"
                  [id]="'option-' + i"
                  [name]="'question-' + currentQuestionIndex"
                  [value]="option.text"
                  [(ngModel)]="selectedAnswers[currentQuestionIndex]"
                  class="option-input"
                >
                <label [for]="'option-' + i" class="option-label">
                  {{ option.text }}
                </label>
              </div>
            </div>

            <div class="question-text-input" *ngIf="currentQuestion.type === 'text'">
              <textarea 
                [(ngModel)]="selectedAnswers[currentQuestionIndex]"
                placeholder="Enter your answer..."
                class="text-input"
                rows="4"
              ></textarea>
            </div>

            <div class="question-true-false" *ngIf="currentQuestion.type === 'true_false'">
              <div class="option-item">
                <input type="radio" [id]="'true'" [name]="'question-' + currentQuestionIndex" value="true" [(ngModel)]="selectedAnswers[currentQuestionIndex]" class="option-input">
                <label for="true" class="option-label">True</label>
              </div>
              <div class="option-item">
                <input type="radio" [id]="'false'" [name]="'question-' + currentQuestionIndex" value="false" [(ngModel)]="selectedAnswers[currentQuestionIndex]" class="option-input">
                <label for="false" class="option-label">False</label>
              </div>
            </div>
          </div>
        </div>

        <div class="quiz-navigation">
          <button class="btn btn-outline" (click)="previousQuestion()" [disabled]="currentQuestionIndex === 0">
            <span class="material-icons">arrow_back</span>
            Previous
          </button>
          
          <div class="question-indicators">
            <button 
              *ngFor="let question of quiz.questions; let i = index"
              class="indicator-btn"
              [class.answered]="selectedAnswers[i]"
              [class.current]="i === currentQuestionIndex"
              (click)="goToQuestion(i)"
            >
              {{ i + 1 }}
            </button>
          </div>
          
          <button class="btn btn-primary" (click)="nextQuestion()" *ngIf="currentQuestionIndex < (quiz.questions?.length || 0) - 1">
            Next
            <span class="material-icons">arrow_forward</span>
          </button>
          
          <button class="btn btn-success" (click)="submitQuiz()" *ngIf="currentQuestionIndex === (quiz.questions?.length || 0) - 1">
            Submit Quiz
            <span class="material-icons">check</span>
          </button>
        </div>
      </div>

      <div class="quiz-sidebar">
        <div class="quiz-summary">
          <h3>Quiz Summary</h3>
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">Questions</span>
              <span class="stat-value">{{ quiz.questions?.length || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Answered</span>
              <span class="stat-value">{{ answeredQuestions }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Remaining</span>
              <span class="stat-value">{{ remainingQuestions }}</span>
            </div>
          </div>
        </div>

        <div class="question-list">
          <h3>Questions</h3>
          <div class="question-item" *ngFor="let question of quiz.questions; let i = index">
            <div class="question-item-header">
              <span class="question-number">{{ i + 1 }}</span>
              <div class="question-item-info">
                <h4>{{ question.text.substring(0, 50) }}...</h4>
                <span class="question-type">{{ getQuestionTypeLabel(question.type) }}</span>
              </div>
              <div class="question-status">
                <span class="material-icons" *ngIf="selectedAnswers[i]">check_circle</span>
                <span class="material-icons" *ngIf="!selectedAnswers[i]">radio_button_unchecked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-taker {
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
      align-items: center;
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quiz-info h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 24px;
    }

    .quiz-progress {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .quiz-progress span {
      color: #666;
      font-size: 14px;
    }

    .progress-bar {
      width: 200px;
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

    .quiz-timer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f8f9fa;
      border-radius: 8px;
      color: #e74c3c;
      font-weight: 600;
    }

    .quiz-content {
      display: grid;
      gap: 30px;
    }

    .question-container {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .question-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 20px;
    }

    .question-meta {
      display: flex;
      gap: 16px;
    }

    .question-type,
    .question-points {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .question-type {
      background: #d1ecf1;
      color: #0c5460;
    }

    .question-points {
      background: #fff3cd;
      color: #856404;
    }

    .question-text {
      color: #2c3e50;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .question-options,
    .question-true-false {
      display: grid;
      gap: 12px;
    }

    .option-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      transition: border-color 0.3s ease;
      cursor: pointer;
    }

    .option-item:hover {
      border-color: #667eea;
    }

    .option-input {
      margin: 0;
    }

    .option-label {
      flex: 1;
      cursor: pointer;
      color: #2c3e50;
      font-size: 14px;
    }

    .text-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 14px;
      resize: vertical;
    }

    .text-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .quiz-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .question-indicators {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .indicator-btn {
      width: 40px;
      height: 40px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background: white;
      color: #666;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .indicator-btn.answered {
      background: #27ae60;
      color: white;
      border-color: #27ae60;
    }

    .indicator-btn.current {
      background: #667eea;
      color: white;
      border-color: #667eea;
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

    .btn-outline {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-outline:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    .btn-success {
      background: #27ae60;
      color: white;
    }

    .btn-success:hover {
      background: #229954;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .quiz-sidebar {
      display: grid;
      gap: 20px;
      align-content: start;
    }

    .quiz-summary,
    .question-list {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quiz-summary h3,
    .question-list h3 {
      color: #2c3e50;
      margin-bottom: 16px;
      font-size: 18px;
    }

    .summary-stats {
      display: grid;
      gap: 12px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
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

    .question-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .question-item {
      padding: 12px 0;
      border-bottom: 1px solid #e1e5e9;
    }

    .question-item:last-child {
      border-bottom: none;
    }

    .question-item-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .question-number {
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

    .question-item-info {
      flex: 1;
    }

    .question-item-info h4 {
      color: #2c3e50;
      margin: 0 0 4px 0;
      font-size: 14px;
    }

    .question-item-info .question-type {
      color: #666;
      font-size: 12px;
    }

    .question-status .material-icons {
      color: #27ae60;
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .quiz-taker {
        grid-template-columns: 1fr;
        padding: 10px;
      }

      .quiz-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .quiz-navigation {
        flex-direction: column;
        gap: 16px;
      }

      .question-indicators {
        justify-content: center;
      }
    }
  `]
})
export class QuizTakerComponent implements OnInit {
  quiz: Quiz | null = null;
  currentQuestionIndex = 0;
  selectedAnswers: any[] = [];
  timeRemaining = 0;
  progressPercentage = 0;
  answeredQuestions = 0;
  remainingQuestions = 0;

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
      description: 'Test your knowledge of JavaScript fundamentals',
      questions: [
        {
          id: '1',
          quizId: quizId,
          text: 'What is the correct way to declare a variable in JavaScript?',
          type: QuestionType.SINGLE_CHOICE,
          options: [
            { id: '1', text: 'var x = 5;', isCorrect: false },
            { id: '2', text: 'let x = 5;', isCorrect: true },
            { id: '3', text: 'const x = 5;', isCorrect: false },
            { id: '4', text: 'variable x = 5;', isCorrect: false }
          ],
          points: 10,
          order: 1
        },
        {
          id: '2',
          quizId: quizId,
          text: 'Which of the following are JavaScript data types?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            { id: '1', text: 'String', isCorrect: true },
            { id: '2', text: 'Number', isCorrect: true },
            { id: '3', text: 'Boolean', isCorrect: true },
            { id: '4', text: 'Array', isCorrect: false }
          ],
          points: 15,
          order: 2
        }
      ],
      timeLimit: 30,
      passingScore: 70,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.timeRemaining = (this.quiz.timeLimit || 0) * 60;
    this.selectedAnswers = new Array(this.quiz.questions?.length || 0);
    this.updateProgress();
  }

  get currentQuestion(): Question | null {
    return this.quiz?.questions?.[this.currentQuestionIndex] || null;
  }

  getQuestionTypeLabel(type: QuestionType): string {
    switch (type) {
      case QuestionType.SINGLE_CHOICE: return 'Single Choice';
      case QuestionType.MULTIPLE_CHOICE: return 'Multiple Choice';
      case QuestionType.TRUE_FALSE: return 'True/False';
      case QuestionType.TEXT: return 'Text';
      default: return 'Unknown';
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  updateProgress(): void {
    if (this.quiz?.questions) {
      this.progressPercentage = ((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100;
      this.answeredQuestions = this.selectedAnswers.filter(answer => answer !== undefined && answer !== null && answer !== '').length;
      this.remainingQuestions = this.quiz.questions.length - this.answeredQuestions;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.updateProgress();
    }
  }

  nextQuestion(): void {
    if (this.quiz?.questions && this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this.updateProgress();
    }
  }

  goToQuestion(index: number): void {
    if (this.quiz?.questions && index >= 0 && index < this.quiz.questions.length) {
      this.currentQuestionIndex = index;
      this.updateProgress();
    }
  }

  submitQuiz(): void {
    if (this.quiz) {
      console.log('Submitting quiz with answers:', this.selectedAnswers);
      // Navigate to results page
    }
  }
} 