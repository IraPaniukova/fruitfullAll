using fruitfullServer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Utils;
using fruitfullServer.DTO.Users;
using Google.Apis.Auth;

namespace fruitfullServer.Services;
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
        
        try
        {
            var payload = !string.IsNullOrEmpty(dto.IdToken) 
                ? await GoogleJsonWebSignature.ValidateAsync(dto.IdToken) : null;
            var email = payload?.Email;
            var googleId = payload?.Subject;

            User user = new()
            {
                Email = email ?? dto.Email,
                AuthProvider = googleId != null ? "Google" : null,
                GoogleId = googleId
            };
            if (dto.AuthProvider == "Google")
            {
                user.PasswordHash = null; // Google users don't use password
            }
            else
            {
                if (string.IsNullOrEmpty(dto.Password)) throw new ArgumentException("Password cannot be null or empty.");
                user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
            }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.ToUserOutputDto();  //from utils
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
    }
    
     public async Task<UserOutputLoginDto> UpdateUserLoginAsync(int id, UserUpdateLoginDto dto, int currentUserId) 
    {
        if (id != currentUserId)
            throw new UnauthorizedAccessException("You do not have permission.");
        
        var user = await _context.Users.FindAsync(id) ?? throw new KeyNotFoundException("User not found");
        if (user.AuthProvider != "local")
        throw new InvalidOperationException("Cannot update login info for non-local users.");

        if (dto.Email != null && user.Email != dto.Email) user.Email = dto.Email;
        if (!string.IsNullOrWhiteSpace(dto.Password)) user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
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
        return new UserOutputLoginDto
        {
            UserId = user.UserId,
            Email=user.Email 
        };  
    }
    public async Task<UserOutputDto> UpdateUserAsync(int id, UserUpdateDto dto, int currentUserId) 
    {
        if (id != currentUserId)
        throw new UnauthorizedAccessException("You do not have permission.");
        
        bool nicknameExists = _context.Users.Any(u => u.Nickname == dto.Nickname&&u.Nickname!=null); 
        if (nicknameExists)  throw new Exception("Nickname already in use. Please choose another.");

        var user = await _context.Users.FindAsync(id) ?? throw new KeyNotFoundException("User not found");
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
        return user.ToUserOutputDto();  //from utils
    }
}