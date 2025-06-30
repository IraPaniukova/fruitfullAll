namespace fruitfullServer.DTO.Posts;
public class PostUpdateDto
{
    public string? Content { get; set; } = null!;
    public string? Opinion { get; set; }
    public string? Company { get; set; } = null!;
    public string? Industry { get; set; } = null!;
    public int? Year { get; set; }
    public string? Country { get; set; } = null!;
    public int? StressLevel { get; set; }
    public string? QuestionType { get; set; } = null!;
    public string? InterviewFormat { get; set; } = null!;   
}