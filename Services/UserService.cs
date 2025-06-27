using fruitfullServer.Models;
using fruitfullServer.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


public class UserService
{
    private readonly FruitfullDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ILogger<UserService> _logger;

    public UserService
    (FruitfullDbContext context, IPasswordHasher<User> passwordHasher, ILogger<UserService> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task<UserOutputDto> CreateUserAsync(UserInputDto dto)
    {
        var user = new User
        {
            Email = dto.Email,
            Country = dto.Country,
            Theme = dto.Theme ?? "light",
            Nickname = dto.Nickname,
            ProfileImage = dto.ProfileImage,
            AuthProvider = dto.AuthProvider,
            GoogleId = dto.GoogleId,
            CreatedAt = DateTime.UtcNow,
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
        try
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to save user to DB.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error.");
            throw;
        }
        return user.ToOutputDto();  //from utils
    }
    
    public async Task<UserOutputDto> UpdateUserAsync(int id, UserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) throw new KeyNotFoundException("User not found");

        if (dto.Email != null && user.Email != dto.Email) user.Email = dto.Email;
        if (!string.IsNullOrWhiteSpace(dto.Password)) user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
        if (dto.Country != null && user.Country != dto.Country) user.Country = dto.Country;
        if (dto.Theme != null && user.Theme != dto.Theme) user.Theme = dto.Theme;
        if (dto.Nickname != null && user.Nickname != dto.Nickname) user.Nickname = dto.Nickname;
        if (dto.ProfileImage != null && user.ProfileImage != dto.ProfileImage) user.ProfileImage = dto.ProfileImage;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to update user in DB.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error.");
            throw;
        }
        return user.ToOutputDto();  //from utils
    }
}