using fruitfullServer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Utils;
using fruitfullServer.DTO.Users;

namespace fruitfullServer.Services;
public class UserService
{
    private readonly FruitfullDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ILogger<UserService> _logger;
    private readonly IGoogleValidator _googleValidator;


    public UserService
    (FruitfullDbContext context, IPasswordHasher<User> passwordHasher, ILogger<UserService> logger, IGoogleValidator googleValidator)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
        _googleValidator = googleValidator;
    }

    public async Task<UserOutputDto> CreateUserAsync(UserInputDto dto)
    {
        
        try
        {
            var payload = !string.IsNullOrEmpty(dto.IdToken) ?
                 await _googleValidator.ValidateAsync(dto.IdToken) : null;
            var email = payload?.Email;
            var googleId = payload?.Subject;

            User user = new()
            {
                Email = email ?? dto.Email,
                AuthProvider = googleId != null ? "Google" : null,
                GoogleId = googleId
            };
            if (googleId!=null)
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
    
     public virtual async Task<UserOutputLoginDto> UpdateUserLoginAsync( UserUpdateLoginDto dto, int currentUserId) 
    {       
        var user = await _context.Users.FindAsync(currentUserId) ?? throw new KeyNotFoundException("User not found");
        if (user.AuthProvider != "local")
        throw new InvalidOperationException("Cannot update login info for non-local users.");

        if (dto.Email != null && user.Email != dto.Email) user.Email = dto.Email;
        
        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            if (string.IsNullOrEmpty(dto.Password))
                    throw new ArgumentException("Current password must be provided.");
            var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash!, dto.Password);
            if (verification == PasswordVerificationResult.Failed)
                throw new UnauthorizedAccessException("Old password is incorrect.");
            
            if (dto.NewPassword == dto.Password)
                throw new ArgumentException("New password cannot be the same as old password.");

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);
        }
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
    public async Task<UserOutputDto> UpdateUserAsync( UserUpdateDto dto, int currentUserId) 
    {
        bool nicknameExists = _context.Users.Any(u => u.Nickname == dto.Nickname && u.UserId != currentUserId && u.Nickname != null);
 
        if (nicknameExists)  throw new Exception("Nickname already in use. Please choose another.");

        var user = await _context.Users.FindAsync(currentUserId) ?? throw new KeyNotFoundException("User not found");
        if (dto.Country != null && user.Country != dto.Country) user.Country = dto.Country;
        if (dto.Theme != null && user.Theme != dto.Theme) user.Theme = dto.Theme;
        if ( user.Nickname != dto.Nickname) user.Nickname = dto.Nickname;  
        if ( user.ProfileImage != dto.ProfileImage) user.ProfileImage = dto.ProfileImage; //user nickname and profile image should allow to save null

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