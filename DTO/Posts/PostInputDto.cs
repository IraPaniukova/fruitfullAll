using System.ComponentModel.DataAnnotations;
using fruitfullServer.DTO.Tags;

namespace fruitfullServer.DTO.Posts;

public class PostInputDto
{
    [Required]
    public string Content { get; set; } = null!;
    public string? Opinion { get; set; }
     [Required]
    public string Company { get; set; } = null!;
     [Required]
    public string Industry { get; set; } = null!;
     [Required]
    public int Year { get; set; }
     [Required]
    public string Country { get; set; } = null!;
     [Required]
    public int StressLevel { get; set; }
     [Required]
    public string QuestionType { get; set; } = null!;
     [Required]
    public string InterviewFormat { get; set; } = null!;
     [Required]
    public int UserId { get; set; }
    [Required]      
     public List<string> Tags { get; set; } = null!;
}