using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Models;
using fruitfullServer.DTO;
using Microsoft.AspNetCore.Authorization;

namespace fruitfullServer.Controllers;

[Authorize(Roles = "SuperAdmin")]
[Route("api/[controller]")]
[ApiController]
public class UserRoleController : ControllerBase
{
    private readonly FruitfullDbContext _context;
    public UserRoleController(FruitfullDbContext context)
    {
        _context = context;
    }

    //POST /api/UserRole/5/roles   assign a role to a user
    [HttpPost("{userId}/roles")]
    public async Task<IActionResult> AssignRoleToUser(int userId, UserRoleAssignDto input)
    {
        try
        {
            var user = await _context.Users.Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)  return NotFound();

            var role = await _context.Roles.FindAsync(input.RoleId);
            if (role == null)  return NotFound();

            if (user.Roles.Any(r => r.RoleId == input.RoleId))
                return BadRequest("Role already assigned");

            user.Roles.Add(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal server error");
        }
    }
        // DELETE: api/UserRole/5
    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteUserRole(int userId)
    {
        try
        {
            var user = await _context.Users.Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return NotFound();

            user.Roles.Clear();
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
    //PUT /api/UserRole/5/roles   
    [HttpPut("{userId}/roles")]
    public async Task<IActionResult> ReassignRoleToUser(int userId, UserRoleAssignDto input)
    {
        var deleteResult = await DeleteUserRole(userId);
        if (deleteResult is NotFoundResult)
        return deleteResult;

        var assignResult = await AssignRoleToUser(userId, input);
        return assignResult;
    }
}

