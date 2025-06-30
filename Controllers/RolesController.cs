using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Models;
using fruitfullServer.DTO;
using Microsoft.AspNetCore.Authorization;
using fruitfullServer.DTO.Roles;

namespace fruitfullServer.Controllers;

[Authorize(Roles = "SuperAdmin")]
[Route("api/[controller]")]
[ApiController]
public class RolesController : ControllerBase
{
    private readonly FruitfullDbContext _context;

    public RolesController(FruitfullDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<RoleOutputDto>>> GetRoles()
    {
        try
        {
            var roles = await _context.Roles.ToListAsync();
            var result = roles.Select(r => new RoleOutputDto
            {
                RoleId = r.RoleId,
                RoleName = r.RoleName
            }).ToList();

            return Ok(result);
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<RoleOutputDto>> CreateRole(RoleCreateDto input)
    {
        try
        {
            var role = new Role
            {
                RoleName = input.RoleName
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            var result = new RoleOutputDto
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName
            };

            return CreatedAtAction(nameof(GetRoles), new { id = role.RoleId }, result);
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        try
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
                return NotFound();

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal server error");
        }
    }
}
