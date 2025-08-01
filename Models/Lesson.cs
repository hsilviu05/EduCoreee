using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class Lesson
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string CourseId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public string? VideoUrl { get; set; }
        
        public int Duration { get; set; } // in minutes
        
        public int Order { get; set; }
        
        public bool IsPublished { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Course Course { get; set; } = null!;
    }
} 