using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Models;
using fruitfullServer.Services;
using fruitfullServer.Utils;
using fruitfullServer.DTO.Users;
using Microsoft.AspNetCore.Authorization;


namespace fruitfullServer.Controllers;

// [Authorize(Policy = "LoginPolicy")]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly FruitfullDbContext _context;
    private readonly UserService _userService;
    public UsersController(FruitfullDbContext context, UserService userService)
    {
        _context = context;
        _userService = userService;
    }

    // GET: api/Users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserOutputDto>>> GetUsers()
    { 
        var users = await _context.Users.ToListAsync();
        var result = users.Select(user => user.ToUserOutputDto());
        return Ok(result);
    }

    // GET: api/Users/5
    [HttpGet("{id}")]
    public async Task<ActionResult<UserOutputDto>> GetUser(int id)
    {
        var users = await _context.Users.FindAsync(id);           

        if (users == null)
        {
            return NotFound();
        }
        var result = users.ToUserOutputDto();
        return Ok(result);
    }

    // POST: api/Users
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

    // PUT: api/Users/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutUser(int id, [FromBody] UserUpdateDto user)
    {
        try
        {
            await _userService.UpdateUserAsync(id, user);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }

    }

    // DELETE: api/Users/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

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

