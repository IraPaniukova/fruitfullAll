namespace fruitfullServer.DTO.Posts;
public class PostSummaryDto
{
    public int PostId { get; set; }
    public string Content { get; set; } = null!;
    public string Industry { get; set; } = null!;
    public int StressLevel { get; set; }
    public DateTime? CreatedAt { get; set; }
}