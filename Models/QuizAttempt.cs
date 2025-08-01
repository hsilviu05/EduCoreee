using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class QuizAttempt
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        public string QuizId { get; set; } = string.Empty;
        
        public int Score { get; set; } = 0;
        
        public bool Passed { get; set; } = false;
        
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? CompletedAt { get; set; }
        
        public int TimeSpent { get; set; } = 0; // in seconds
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Quiz Quiz { get; set; } = null!;
        public virtual ICollection<QuizAnswer> Answers { get; set; } = new List<QuizAnswer>();
    }
} 