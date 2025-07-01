namespace fruitfullServer.DTO.Posts;
public class PostUpdateDto
{
    public string? Content { get; set; } 
    public string? Opinion { get; set; }
    public string? Company { get; set; } 
    public string? Industry { get; set; } 
    public int? Year { get; set; }
    public string? Country { get; set; } 
    public int? StressLevel { get; set; }
    public string? QuestionType { get; set; } 
    public string? InterviewFormat { get; set; }    
}