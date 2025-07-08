using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Models;
using fruitfullServer.Services;
using fruitfullServer.Utils;
using fruitfullServer.DTO.Users;
using Microsoft.AspNetCore.Authorization;


namespace fruitfullServer.Controllers;

[Authorize(Policy = "LoginPolicy")]
[Route("api/[controller]")]
[ApiController]
public class UsersController : BaseController
{
    private readonly FruitfullDbContext _context;
    private readonly UserService _userService;
    public UsersController(FruitfullDbContext context, UserService userService)
    {
        _context = context;
        _userService = userService;
    }

    // GET: api/Users
    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserOutputDto>>> GetUsers()
    { 
        var users = await _context.Users.ToListAsync();
        var result = users.Select(user => user.ToUserOutputDto());
        return Ok(result);
    }

    // GET: api/Users/me
    [HttpGet("me")]
    public async Task<ActionResult<UserOutputDto>> GetUser()
    {
        var currentUserId = GetLoggedInUserId();
        var users = await _context.Users.FindAsync(currentUserId);           

        if (users == null)
        {
            return NotFound();
        }
        var result = users.ToUserOutputDto();
        return Ok(result);
    }

    // POST: api/Users
   [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<UserOutputDto>> PostUser(UserInputDto user)
    {
        try
        {
            var _user = await _userService.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUser), new { id = _user.UserId }, _user);
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = "Unable to save user: " + ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error: " + ex.Message });
        }
    }

    // PUT: api/Users/me
    [HttpPut("me")]
    public async Task<IActionResult> PutUser([FromBody] UserUpdateDto user)
    {
        try
        {
            var currentUserId = GetLoggedInUserId();
            await _userService.UpdateUserAsync( user, currentUserId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }

    }
    
    // PUT: api/Users/me/login   for local users, not Google users
    [HttpPut("me/login")]
    public async Task<IActionResult> PutUserLoginData( [FromBody] UserUpdateLoginDto dto)
    {
        try
        {
            var currentUserId = GetLoggedInUserId();
            var updated = await _userService.UpdateUserLoginAsync( dto,currentUserId);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch
        {
            return StatusCode(500, "Internal server error");
        }
    }


   // DELETE api/Users/me — current user deletes own profile
    [HttpDelete("me")]
    public async Task<IActionResult> DeleteMe()
    {
        try
        {
            var currentUserId = GetLoggedInUserId();

            var user = await _context.Users.FindAsync(currentUserId);
            if (user == null) return NotFound();

            var tokens = _context.AuthTokens.Where(t => t.UserId == currentUserId);
            _context.AuthTokens.RemoveRange(tokens);

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    // DELETE api/Users/{id} — admin deletes any user by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var isSuperAdmin = User.IsInRole("SuperAdmin");
            if (!isSuperAdmin) return Forbid();

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var tokens = _context.AuthTokens.Where(t => t.UserId == id);
            _context.AuthTokens.RemoveRange(tokens);

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

}

