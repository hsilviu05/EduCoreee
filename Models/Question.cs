using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class Question
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string QuizId { get; set; } = string.Empty;
        
        [Required]
        public string Text { get; set; } = string.Empty;
        
        [Required]
        public QuestionType Type { get; set; }
        
        public string? CorrectAnswer { get; set; }
        
        public int Points { get; set; } = 1;
        
        public int Order { get; set; }
        
        // Navigation properties
        public virtual Quiz Quiz { get; set; } = null!;
        public virtual ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
        public virtual ICollection<QuizAnswer> Answers { get; set; } = new List<QuizAnswer>();
    }

    public enum QuestionType
    {
        MultipleChoice,
        SingleChoice,
        TrueFalse,
        Text
    }
} 