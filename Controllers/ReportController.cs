using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Models;
using fruitfullServer.Services;
using fruitfullServer.DTO.Reports;
using Microsoft.AspNetCore.Authorization;

namespace fruitfullServer.Controllers;

// [Authorize(Policy = "LoginPolicy")]
[Route("api/[controller]")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly FruitfullDbContext _context;
    private readonly ReportService _reportService;
    public ReportsController(FruitfullDbContext context, ReportService reportService)
    {
        _context = context;
        _reportService = reportService;
    }

    // GET: api/Reports/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ReportOutputDto>> GetReport(int id)
    {
        var report = await _reportService.GetReportByIdAsync(id);
        if (report == null) return NotFound();
        return report;
    }
    
    // POST: api/Reports
    [HttpPost]
    public async Task<ActionResult<ReportOutputDto>> CreateReport(ReportInputDto report)
    {
        try
        {
            var _report = await _reportService.CreateReportAsync(report);
            return CreatedAtAction(nameof(GetReport), new { id = _report.ReportId }, _report);
            
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = "Unable to save report: " + ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error: " + ex.Message });
        }
    }
}