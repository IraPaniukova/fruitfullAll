namespace fruitfullServer.DTO.Posts;

public class PostOutputDto
{
    public int PostId { get; set; }
    public string? Content { get; set; }
    public string? Opinion { get; set; }
    public string? Company { get; set; }
    public string? Industry { get; set; }
    public int Year { get; set; }
    public string? Country { get; set; }
    public int StressLevel { get; set; }
    public string? QuestionType { get; set; }
    public string? InterviewFormat { get; set; }
    public int UserId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public int LikesCount { get; set; }
    public List<string>? Tags { get; set; }
}