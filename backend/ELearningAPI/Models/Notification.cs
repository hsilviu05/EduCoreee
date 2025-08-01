using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class Notification
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        public NotificationType Type { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Message { get; set; } = string.Empty;
        
        public string? Data { get; set; } // JSON data
        
        public bool IsRead { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? ReadAt { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }

    public enum NotificationType
    {
        CourseEnrollment,
        LessonCompleted,
        QuizResult,
        CourseUpdate,
        SystemMessage
    }
} 