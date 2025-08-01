namespace ELearningAPI.DTOs
{
    public class CourseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string InstructorId { get; set; } = string.Empty;
        public string InstructorName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public CourseLevel Level { get; set; }
        public int Duration { get; set; }
        public int EnrolledStudents { get; set; }
        public decimal Rating { get; set; }
        public decimal Price { get; set; }
        public bool IsPublished { get; set; }
        public string? Thumbnail { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<LessonDto> Lessons { get; set; } = new List<LessonDto>();
    }

    public class CreateCourseRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public CourseLevel Level { get; set; }
        public int Duration { get; set; }
        public decimal Price { get; set; }
        public string? Thumbnail { get; set; }
    }

    public class UpdateCourseRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public CourseLevel Level { get; set; }
        public int Duration { get; set; }
        public decimal Price { get; set; }
        public string? Thumbnail { get; set; }
        public bool IsPublished { get; set; }
    }

    public class LessonDto
    {
        public string Id { get; set; } = string.Empty;
        public string CourseId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public int Duration { get; set; }
        public int Order { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateLessonRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public int Duration { get; set; }
        public int Order { get; set; }
    }

    public class UpdateLessonRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public int Duration { get; set; }
        public int Order { get; set; }
        public bool IsPublished { get; set; }
    }

    public class CourseProgressDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string CourseId { get; set; } = string.Empty;
        public string? CurrentLessonId { get; set; }
        public int Progress { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime LastAccessedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public class UpdateProgressRequest
    {
        public string? CurrentLessonId { get; set; }
        public int Progress { get; set; }
    }

    public enum CourseLevel
    {
        Beginner,
        Intermediate,
        Advanced
    }
} 