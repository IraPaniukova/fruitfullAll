namespace fruitfullServer.DTO;

public class ReportInputDto
{
    public int UserId { get; set; }
    public int? PostId { get; set; }
    public int? CommentId { get; set; }
    public string Reason { get; set; } = null!;
}
