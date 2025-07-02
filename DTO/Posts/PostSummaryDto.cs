namespace fruitfullServer.DTO.Posts;

public class PostSummaryDto
{
    public int PostId { get; set; }
    public string? Content { get; set; }
    public string? Industry { get; set; }
    public int StressLevel { get; set; }
    public string? Country { get; set; }
    public DateTime? CreatedAt { get; set; }
    public List<string>? Tags { get; set; }
}