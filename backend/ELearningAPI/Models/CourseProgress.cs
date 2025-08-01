using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class CourseProgress
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        public string CourseId { get; set; } = string.Empty;
        
        public string? CurrentLessonId { get; set; }
        
        public int Progress { get; set; } = 0; // percentage
        
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime LastAccessedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? CompletedAt { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Course Course { get; set; } = null!;
        public virtual Lesson? CurrentLesson { get; set; }
    }
} 