using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ELearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private static List<NotificationDto> _notifications = new List<NotificationDto>
        {
            new NotificationDto
            {
                Id = "1",
                UserId = "user1",
                Message = "Welcome to EduCore! Your account has been created successfully.",
                Type = "welcome",
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new NotificationDto
            {
                Id = "2",
                UserId = "user1",
                Message = "New course available: Introduction to Angular Development",
                Type = "course",
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new NotificationDto
            {
                Id = "3",
                UserId = "user1",
                Message = "You have completed the quiz: JavaScript Basics",
                Type = "quiz",
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<NotificationDto>> GetNotifications()
        {
            // In a real application, you would filter by the current user
            return Ok(_notifications);
        }

        [HttpPut("{id}/read")]
        public ActionResult MarkAsRead(string id)
        {
            var notification = _notifications.FirstOrDefault(n => n.Id == id);
            if (notification == null)
            {
                return NotFound();
            }

            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            return Ok();
        }

        [HttpPut("mark-all-read")]
        public ActionResult MarkAllAsRead()
        {
            foreach (var notification in _notifications)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteNotification(string id)
        {
            var notification = _notifications.FirstOrDefault(n => n.Id == id);
            if (notification == null)
            {
                return NotFound();
            }

            _notifications.Remove(notification);
            return Ok();
        }
    }

    public class NotificationDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
    }
} 