using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ELearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzesController : ControllerBase
    {
        private static List<QuizDto> _quizzes = new List<QuizDto>
        {
            new QuizDto
            {
                Id = "1",
                Title = "JavaScript Basics",
                Description = "Test your knowledge of JavaScript fundamentals",
                CourseId = "2",
                Duration = 30,
                Questions = new List<QuestionDto>
                {
                    new QuestionDto
                    {
                        Id = "1",
                        Text = "What is the correct way to declare a variable in JavaScript?",
                        Type = "multiple_choice",
                        Options = new List<string> { "var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;" },
                        CorrectAnswer = "var x = 5;"
                    },
                    new QuestionDto
                    {
                        Id = "2",
                        Text = "Which method is used to add an element to the end of an array?",
                        Type = "multiple_choice",
                        Options = new List<string> { "push()", "pop()", "shift()", "unshift()" },
                        CorrectAnswer = "push()"
                    }
                },
                IsPublished = true,
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new QuizDto
            {
                Id = "2",
                Title = "Angular Fundamentals",
                Description = "Test your understanding of Angular basics",
                CourseId = "1",
                Duration = 45,
                Questions = new List<QuestionDto>
                {
                    new QuestionDto
                    {
                        Id = "3",
                        Text = "What is a component in Angular?",
                        Type = "multiple_choice",
                        Options = new List<string> { "A class", "A function", "A template", "All of the above" },
                        CorrectAnswer = "All of the above"
                    },
                    new QuestionDto
                    {
                        Id = "4",
                        Text = "Which decorator is used to define a component?",
                        Type = "multiple_choice",
                        Options = new List<string> { "@Component", "@Directive", "@Pipe", "@Service" },
                        CorrectAnswer = "@Component"
                    }
                },
                IsPublished = true,
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            }
        };

        private static List<QuizAttemptDto> _attempts = new List<QuizAttemptDto>();

        [HttpGet]
        public ActionResult<IEnumerable<QuizDto>> GetQuizzes()
        {
            return Ok(_quizzes.Where(q => q.IsPublished));
        }

        [HttpGet("{id}")]
        public ActionResult<QuizDto> GetQuiz(string id)
        {
            var quiz = _quizzes.FirstOrDefault(q => q.Id == id);
            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }

        [HttpGet("attempts")]
        public ActionResult<IEnumerable<QuizAttemptDto>> GetQuizAttempts()
        {
            return Ok(_attempts);
        }

        [HttpPost("{id}/start")]
        public ActionResult<QuizAttemptDto> StartQuiz(string id)
        {
            var quiz = _quizzes.FirstOrDefault(q => q.Id == id);
            if (quiz == null)
            {
                return NotFound();
            }

            var attempt = new QuizAttemptDto
            {
                Id = Guid.NewGuid().ToString(),
                QuizId = id,
                UserId = "user1", // In real app, get from auth
                StartedAt = DateTime.UtcNow,
                Status = "in_progress"
            };

            _attempts.Add(attempt);
            return Ok(attempt);
        }

        [HttpPost("{id}/submit")]
        public ActionResult<QuizAttemptDto> SubmitQuiz(string id, [FromBody] QuizSubmissionDto submission)
        {
            var quiz = _quizzes.FirstOrDefault(q => q.Id == id);
            if (quiz == null)
            {
                return NotFound();
            }

            var attempt = _attempts.FirstOrDefault(a => a.QuizId == id && a.Status == "in_progress");
            if (attempt == null)
            {
                return NotFound();
            }

            // Calculate score (simplified)
            int correctAnswers = 0;
            foreach (var answer in submission.Answers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question != null && question.CorrectAnswer == answer.SelectedAnswer)
                {
                    correctAnswers++;
                }
            }

            attempt.Score = (double)correctAnswers / quiz.Questions.Count * 100;
            attempt.CompletedAt = DateTime.UtcNow;
            attempt.Status = "completed";

            return Ok(attempt);
        }
    }

    public class QuizDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CourseId { get; set; } = string.Empty;
        public int Duration { get; set; }
        public List<QuestionDto> Questions { get; set; } = new List<QuestionDto>();
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class QuestionDto
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new List<string>();
        public string CorrectAnswer { get; set; } = string.Empty;
    }

    public class QuizAttemptDto
    {
        public string Id { get; set; } = string.Empty;
        public string QuizId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public double? Score { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class QuizSubmissionDto
    {
        public List<AnswerDto> Answers { get; set; } = new List<AnswerDto>();
    }

    public class AnswerDto
    {
        public string QuestionId { get; set; } = string.Empty;
        public string SelectedAnswer { get; set; } = string.Empty;
    }
} 