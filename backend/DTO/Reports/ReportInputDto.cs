using System.ComponentModel.DataAnnotations;

namespace fruitfullServer.DTO.Reports;

public class ReportInputDto
{
    public int? PostId { get; set; }
    public int? CommentId { get; set; }
    [Required]
    public string Reason { get; set; } = null!;
}
