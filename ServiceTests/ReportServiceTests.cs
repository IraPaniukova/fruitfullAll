using fruitfullServer.DTO.Posts;
using fruitfullServer.DTO.Reports;
using fruitfullServer.Models;
using fruitfullServer.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace fruitfullTest.ServiceTests;
public class ReportServiceTests
{
    private readonly ReportService _service;
    private readonly FruitfullDbContext _context;
    private readonly Mock<ILogger<ReportService>> _loggerMock;

    public ReportServiceTests()
    {
        var options = new DbContextOptionsBuilder<FruitfullDbContext>()
            .UseInMemoryDatabase("TestDb")
            .Options;

        _context = new FruitfullDbContext(options);
        _loggerMock = new Mock<ILogger<ReportService>>();
        _service = new ReportService(_context, _loggerMock.Object);
    }

    [Fact]
    public async Task GetReportByIdAsync_ReturnsReport_WhenExists()
    {
        var report = new Report { Reason = "Spam", UserId = 1 };
        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        var result = await _service.GetReportByIdAsync(report.ReportId);

        Assert.NotNull(result);
        Assert.Equal("Spam", result!.Reason);
    }

    [Fact]
    public async Task GetReportByIdAsync_ReturnsNull_WhenNotFound()
    {
        var result = await _service.GetReportByIdAsync(999);

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateReportAsync_AddsPostReportToDb()
    {
        var dto = new ReportInputDto { PostId = 1, CommentId = null, Reason = "Offensive" };

        var result = await _service.CreateReportAsync(dto, currentUserId: 42);

        var reportInDb = await _context.Reports.FirstOrDefaultAsync(r => r.ReportId == result.ReportId);

        Assert.NotNull(reportInDb);
        Assert.Equal(42, reportInDb!.UserId);
        Assert.Equal("Offensive", reportInDb.Reason);
    }

     [Fact]
    public async Task CreateReportAsync_AddsCommentReportToDb()
    {
        var dto = new ReportInputDto { PostId = null, CommentId = 1, Reason = "Offensive" };

        var result = await _service.CreateReportAsync(dto, currentUserId: 42);

        var reportInDb = await _context.Reports.FirstOrDefaultAsync(r => r.ReportId == result.ReportId);

        Assert.NotNull(reportInDb);
        Assert.Equal(42, reportInDb!.UserId);
        Assert.Equal("Offensive", reportInDb.Reason);
    }

   [Fact]
    public async Task CreateReportAsync_Throws_WhenReasonIsNull()
    {
        var dto = new ReportInputDto
        {
            PostId = 1,
            CommentId = null,
            Reason = null!  // Simulate missing required reason
        };

        await Assert.ThrowsAsync<ArgumentException>(async () =>
            await _service.CreateReportAsync(dto, currentUserId: 1));
    }

}
