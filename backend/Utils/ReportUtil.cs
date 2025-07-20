using fruitfullServer.DTO.Reports;
using fruitfullServer.Models;

namespace fruitfullServer.Utils;

public static class ReportUtil
{
    public static ReportOutputDto ToReportOutputDto(this Report report) => new()
    {
        ReportId = report.ReportId,
        UserId = report.UserId,
        PostId = report.PostId,
        CommentId = report.CommentId,
        Reason = report.Reason,
        CreatedAt = report.CreatedAt
    };
}