using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class QuestionOption
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string QuestionId { get; set; } = string.Empty;
        
        [Required]
        public string Text { get; set; } = string.Empty;
        
        public bool IsCorrect { get; set; } = false;
        
        // Navigation properties
        public virtual Question Question { get; set; } = null!;
    }
} 