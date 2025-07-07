using fruitfullServer.DTO.Reports;
using fruitfullServer.Models;
using fruitfullServer.Utils;
using Microsoft.EntityFrameworkCore;

namespace fruitfullServer.Services;

public class ReportService
{
    private readonly FruitfullDbContext _context;
    private readonly ILogger<ReportService> _logger;

    public ReportService(FruitfullDbContext context, ILogger<ReportService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ReportOutputDto?> GetReportByIdAsync(int id)
    {
    try
    {
        var report = await _context.Reports
            .FirstOrDefaultAsync(p => p.ReportId == id);
        if (report == null) return null;
        return report.ToReportOutputDto();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting report by ID {ReportId}", id);
        throw;
    }
    }
    public async Task<ReportOutputDto> CreateReportAsync(ReportInputDto dto,int currentUserId)
    {
        if (string.IsNullOrWhiteSpace(dto.Reason))  throw new ArgumentException("Reason is required.");
        var report = new Report
        {
            UserId = currentUserId,
            PostId = dto.PostId,
            CommentId = dto.CommentId,
            Reason = dto.Reason
        };
        try
        {
            _context.Reports.Add(report);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to save report to DB.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error.");
            throw;
        }
       return report.ToReportOutputDto();
    }
}
