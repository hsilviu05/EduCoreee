using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ELearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private static List<CourseDto> _courses = new List<CourseDto>
        {
            new CourseDto
            {
                Id = "1",
                Title = "Introduction to Angular Development",
                Description = "Learn the fundamentals of Angular framework and build modern web applications.",
                InstructorId = "instructor1",
                InstructorName = "John Doe",
                Category = "Web Development",
                Level = "Beginner",
                Duration = 120,
                Thumbnail = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
                Lessons = new List<LessonDto>
                {
                    new LessonDto { Id = "1", Title = "Getting Started with Angular", Duration = 15 },
                    new LessonDto { Id = "2", Title = "Components and Templates", Duration = 20 },
                    new LessonDto { Id = "3", Title = "Services and Dependency Injection", Duration = 25 }
                },
                EnrolledStudents = 45,
                Rating = 4.5,
                Price = 0,
                IsPublished = true,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new CourseDto
            {
                Id = "2",
                Title = "Advanced JavaScript Concepts",
                Description = "Master advanced JavaScript concepts including closures, promises, and async programming.",
                InstructorId = "instructor2",
                InstructorName = "Jane Smith",
                Category = "Programming",
                Level = "Intermediate",
                Duration = 180,
                Thumbnail = "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
                Lessons = new List<LessonDto>
                {
                    new LessonDto { Id = "4", Title = "Closures and Scope", Duration = 30 },
                    new LessonDto { Id = "5", Title = "Promises and Async/Await", Duration = 35 },
                    new LessonDto { Id = "6", Title = "ES6+ Features", Duration = 25 }
                },
                EnrolledStudents = 32,
                Rating = 4.8,
                Price = 0,
                IsPublished = true,
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new CourseDto
            {
                Id = "3",
                Title = "React Fundamentals",
                Description = "Build interactive user interfaces with React and understand component-based architecture.",
                InstructorId = "instructor1",
                InstructorName = "John Doe",
                Category = "Web Development",
                Level = "Beginner",
                Duration = 150,
                Thumbnail = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
                Lessons = new List<LessonDto>
                {
                    new LessonDto { Id = "7", Title = "Introduction to React", Duration = 20 },
                    new LessonDto { Id = "8", Title = "JSX and Components", Duration = 25 },
                    new LessonDto { Id = "9", Title = "State and Props", Duration = 30 }
                },
                EnrolledStudents = 28,
                Rating = 4.6,
                Price = 0,
                IsPublished = true,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<CourseDto>> GetCourses()
        {
            return Ok(_courses.Where(c => c.IsPublished));
        }

        [HttpGet("{id}")]
        public ActionResult<CourseDto> GetCourse(string id)
        {
            var course = _courses.FirstOrDefault(c => c.Id == id);
            if (course == null)
            {
                return NotFound();
            }

            return Ok(course);
        }
    }

    public class CourseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string InstructorId { get; set; } = string.Empty;
        public string InstructorName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public int Duration { get; set; }
        public List<LessonDto> Lessons { get; set; } = new List<LessonDto>();
        public int EnrolledStudents { get; set; }
        public double Rating { get; set; }
        public decimal Price { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
    }

    public class LessonDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int Duration { get; set; }
    }
} 