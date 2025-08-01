import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="quiz-results">
      <div class="results-header">
        <h1>Quiz Results</h1>
        <p>Your performance summary</p>
      </div>

      <div class="results-overview">
        <div class="score-card">
          <div class="score-circle" [class.passed]="quizResult.passed" [class.failed]="!quizResult.passed">
            <div class="score-value">{{ quizResult.score }}%</div>
            <div class="score-label">{{ quizResult.passed ? 'Passed' : 'Failed' }}</div>
          </div>
        </div>

        <div class="results-stats">
          <div class="stat-item">
            <span class="material-icons">schedule</span>
            <div class="stat-content">
              <h3>Time Taken</h3>
              <p>{{ formatTime(quizResult.timeSpent) }}</p>
            </div>
          </div>
          
          <div class="stat-item">
            <span class="material-icons">quiz</span>
            <div class="stat-content">
              <h3>Questions</h3>
              <p>{{ quizResult.totalQuestions }} total</p>
            </div>
          </div>
          
          <div class="stat-item">
            <span class="material-icons">check_circle</span>
            <div class="stat-content">
              <h3>Correct</h3>
              <p>{{ quizResult.correctAnswers }} answers</p>
            </div>
          </div>
          
          <div class="stat-item">
            <span class="material-icons">school</span>
            <div class="stat-content">
              <h3>Passing Score</h3>
              <p>{{ quizResult.passingScore }}% required</p>
            </div>
          </div>
        </div>
      </div>

      <div class="results-content">
        <div class="question-review">
          <h2>Question Review</h2>
          <div class="question-item" *ngFor="let answer of quizResult.answers; let i = index">
            <div class="question-header">
              <h3>Question {{ i + 1 }}</h3>
              <div class="question-status" [class.correct]="answer.isCorrect" [class.incorrect]="!answer.isCorrect">
                <span class="material-icons">{{ answer.isCorrect ? 'check_circle' : 'cancel' }}</span>
                <span>{{ answer.isCorrect ? 'Correct' : 'Incorrect' }}</span>
              </div>
            </div>
            
            <div class="question-content">
              <p class="question-text">{{ answer.questionText }}</p>
              
              <div class="answer-details">
                <div class="answer-item">
                  <span class="answer-label">Your Answer:</span>
                  <span class="answer-value">{{ answer.userAnswer }}</span>
                </div>
                
                <div class="answer-item" *ngIf="!answer.isCorrect">
                  <span class="answer-label">Correct Answer:</span>
                  <span class="answer-value correct">{{ answer.correctAnswer }}</span>
                </div>
                
                <div class="answer-item">
                  <span class="answer-label">Points:</span>
                  <span class="answer-value">{{ answer.points }} / {{ answer.maxPoints }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="results-sidebar">
          <div class="performance-breakdown">
            <h3>Performance Breakdown</h3>
            <div class="breakdown-item">
              <div class="breakdown-label">
                <span>Correct Answers</span>
                <span>{{ quizResult.correctAnswers }}/{{ quizResult.totalQuestions }}</span>
              </div>
              <div class="breakdown-bar">
                <div class="breakdown-fill correct" [style.width.%]="(quizResult.correctAnswers / quizResult.totalQuestions) * 100"></div>
              </div>
            </div>
            
            <div class="breakdown-item">
              <div class="breakdown-label">
                <span>Incorrect Answers</span>
                <span>{{ quizResult.incorrectAnswers }}/{{ quizResult.totalQuestions }}</span>
              </div>
              <div class="breakdown-bar">
                <div class="breakdown-fill incorrect" [style.width.%]="(quizResult.incorrectAnswers / quizResult.totalQuestions) * 100"></div>
              </div>
            </div>
          </div>

          <div class="quiz-actions">
            <h3>Next Steps</h3>
            <div class="action-buttons">
              <button class="btn btn-primary" (click)="retakeQuiz()">
                <span class="material-icons">refresh</span>
                Retake Quiz
              </button>
              
              <button class="btn btn-outline" (click)="reviewCourse()">
                <span class="material-icons">school</span>
                Review Course
              </button>
              
              <button class="btn btn-outline" (click)="shareResults()">
                <span class="material-icons">share</span>
                Share Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-results {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .results-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .results-header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 32px;
    }

    .results-header p {
      color: #666;
      font-size: 16px;
    }

    .results-overview {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 30px;
      margin-bottom: 40px;
    }

    .score-card {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .score-circle {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 8px solid;
      transition: all 0.3s ease;
    }

    .score-circle.passed {
      background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
      border-color: #27ae60;
    }

    .score-circle.failed {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      border-color: #e74c3c;
    }

    .score-value {
      font-size: 48px;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
    }

    .score-label {
      font-size: 18px;
      font-weight: 600;
      color: white;
    }

    .results-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-item .material-icons {
      font-size: 32px;
      color: #667eea;
    }

    .stat-content h3 {
      color: #2c3e50;
      margin: 0 0 4px 0;
      font-size: 16px;
    }

    .stat-content p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .results-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }

    .question-review {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .question-review h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .question-item {
      margin-bottom: 24px;
      padding: 20px;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .question-item:last-child {
      margin-bottom: 0;
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .question-header h3 {
      color: #2c3e50;
      margin: 0;
      font-size: 18px;
    }

    .question-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .question-status.correct {
      background: #d4edda;
      color: #155724;
    }

    .question-status.incorrect {
      background: #f8d7da;
      color: #721c24;
    }

    .question-text {
      color: #2c3e50;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .answer-details {
      display: grid;
      gap: 12px;
    }

    .answer-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: white;
      border-radius: 6px;
    }

    .answer-label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .answer-value {
      color: #2c3e50;
      font-weight: 600;
      font-size: 14px;
    }

    .answer-value.correct {
      color: #27ae60;
    }

    .results-sidebar {
      display: grid;
      gap: 20px;
      align-content: start;
    }

    .performance-breakdown,
    .quiz-actions {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .performance-breakdown h3,
    .quiz-actions h3 {
      color: #2c3e50;
      margin-bottom: 16px;
      font-size: 18px;
    }

    .breakdown-item {
      margin-bottom: 16px;
    }

    .breakdown-item:last-child {
      margin-bottom: 0;
    }

    .breakdown-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;
      color: #666;
    }

    .breakdown-bar {
      width: 100%;
      height: 8px;
      background: #e1e5e9;
      border-radius: 4px;
      overflow: hidden;
    }

    .breakdown-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .breakdown-fill.correct {
      background: #27ae60;
    }

    .breakdown-fill.incorrect {
      background: #e74c3c;
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
      .quiz-results {
        padding: 10px;
      }

      .results-overview {
        grid-template-columns: 1fr;
      }

      .results-content {
        grid-template-columns: 1fr;
      }

      .score-circle {
        width: 150px;
        height: 150px;
      }

      .score-value {
        font-size: 36px;
      }

      .results-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QuizResultsComponent implements OnInit {
  quizResult: any = {
    score: 85,
    passed: true,
    timeSpent: 1200, // seconds
    totalQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    passingScore: 70,
    answers: [
      {
        questionText: 'What is the correct way to declare a variable in JavaScript?',
        userAnswer: 'let x = 5;',
        correctAnswer: 'let x = 5;',
        isCorrect: true,
        points: 10,
        maxPoints: 10
      },
      {
        questionText: 'Which of the following are JavaScript data types?',
        userAnswer: 'String, Number, Boolean',
        correctAnswer: 'String, Number, Boolean, Array',
        isCorrect: false,
        points: 0,
        maxPoints: 15
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.loadQuizResults(quizId);
    }
  }

  loadQuizResults(quizId: string): void {
    // Load quiz results from service
    console.log('Loading quiz results for:', quizId);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  retakeQuiz(): void {
    console.log('Retaking quiz');
    // Navigate to quiz taker
  }

  reviewCourse(): void {
    console.log('Reviewing course');
    // Navigate to course
  }

  shareResults(): void {
    console.log('Sharing results');
    // Implement share functionality
  }
} 