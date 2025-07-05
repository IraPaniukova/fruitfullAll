namespace fruitfullServer.DTO.Reports;

public class ReportInputDto
{
    public int? PostId { get; set; }
    public int? CommentId { get; set; }
    public string Reason { get; set; } = null!;
}
