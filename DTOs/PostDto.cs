namespace fruitfullServer.DTO;
public class PostDto
{
    public int? PostId { get; set; }           // null for create, set for update/get
    public string Content { get; set; } = null!;
    public string? Opinion { get; set; }
    public string Company { get; set; } = null!;
    public string Industry { get; set; } = null!;
    public int Year { get; set; }
    public string Country { get; set; } = null!;
    public int StressLevel { get; set; }
    public string QuestionType { get; set; } = null!;
    public string InterviewFormat { get; set; } = null!;
    public int UserId { get; set; }            // FK, required
    public DateTime? CreatedAt { get; set; }  // optional, mainly for output
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public int LikesCount { get; set; }
}