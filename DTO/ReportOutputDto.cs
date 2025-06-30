namespace fruitfullServer.DTO;
public class ReportOutputDto
{
    public int? ReportId { get; set; }
    public int UserId { get; set; }
    public int? PostId { get; set; }
    public int? CommentId { get; set; }
    public string Reason { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
}