using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class Quiz
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string CourseId { get; set; } = string.Empty;
        
        public string? LessonId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        public int? TimeLimit { get; set; } // in minutes
        
        public int PassingScore { get; set; } = 70; // percentage
        
        public bool IsPublished { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Course Course { get; set; } = null!;
        public virtual Lesson? Lesson { get; set; }
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
        public virtual ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
    }
} 