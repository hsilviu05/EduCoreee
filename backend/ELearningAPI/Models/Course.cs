using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class Course
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string InstructorId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        public CourseLevel Level { get; set; }
        
        public int Duration { get; set; } // in minutes
        
        public int EnrolledStudents { get; set; } = 0;
        
        public decimal Rating { get; set; } = 0;
        
        public decimal Price { get; set; } = 0;
        
        public bool IsPublished { get; set; } = false;
        
        public string? Thumbnail { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual User Instructor { get; set; } = null!;
        public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
        public virtual ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
        public virtual ICollection<CourseProgress> CourseProgresses { get; set; } = new List<CourseProgress>();
    }

    public enum CourseLevel
    {
        Beginner,
        Intermediate,
        Advanced
    }
} 