using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ELearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrolledCoursesController : ControllerBase
    {
        private static List<EnrolledCourseDto> _enrolledCourses = new List<EnrolledCourseDto>
        {
            new EnrolledCourseDto
            {
                Id = "1",
                Title = "JavaScript Fun",
                Description = "Learn the basics of JavaScript programming with fun examples",
                InstructorId = "instructor1",
                InstructorName = "John Doe",
                Category = "Programming",
                Level = "Beginner",
                Duration = 120,
                Thumbnail = "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
                EnrolledStudents = 45,
                Rating = 4.5,
                Price = 0,
                IsPublished = true,
                Progress = 60,
                Status = "in-progress",
                CompletedLessons = 6,
                TotalLessons = 10,
                StartedAt = DateTime.UtcNow.AddDays(-15),
                LastAccessedAt = DateTime.UtcNow.AddDays(-1),
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new EnrolledCourseDto
            {
                Id = "2",
                Title = "React Development",
                Description = "Master React with advanced concepts and real-world projects",
                InstructorId = "instructor2",
                InstructorName = "Jane Smith",
                Category = "Web Development",
                Level = "Intermediate",
                Duration = 180,
                Thumbnail = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
                EnrolledStudents = 32,
                Rating = 4.8,
                Price = 0,
                IsPublished = true,
                Progress = 20,
                Status = "in-progress",
                CompletedLessons = 2,
                TotalLessons = 10,
                StartedAt = DateTime.UtcNow.AddDays(-10),
                LastAccessedAt = DateTime.UtcNow.AddDays(-2),
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<EnrolledCourseDto>> GetEnrolledCourses()
        {
            return Ok(_enrolledCourses);
        }

        [HttpGet("{id}")]
        public ActionResult<EnrolledCourseDto> GetEnrolledCourse(string id)
        {
            var course = _enrolledCourses.FirstOrDefault(c => c.Id == id);
            if (course == null)
            {
                return NotFound();
            }

            return Ok(course);
        }
    }

    public class EnrolledCourseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string InstructorId { get; set; } = string.Empty;
        public string InstructorName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public int Duration { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
        public int EnrolledStudents { get; set; }
        public double Rating { get; set; }
        public decimal Price { get; set; }
        public bool IsPublished { get; set; }
        public int Progress { get; set; }
        public string Status { get; set; } = string.Empty;
        public int CompletedLessons { get; set; }
        public int TotalLessons { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime LastAccessedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 