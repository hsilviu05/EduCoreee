using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class QuizAnswer
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string QuizAttemptId { get; set; } = string.Empty;
        
        [Required]
        public string QuestionId { get; set; } = string.Empty;
        
        [Required]
        public string Answer { get; set; } = string.Empty;
        
        public bool IsCorrect { get; set; } = false;
        
        public int Points { get; set; } = 0;
        
        // Navigation properties
        public virtual QuizAttempt QuizAttempt { get; set; } = null!;
        public virtual Question Question { get; set; } = null!;
    }
} 