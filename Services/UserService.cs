using fruitfullServer.Models;
using fruitfullServer.DTO;
using Microsoft.AspNetCore.Identity;

public class UserServices
{
    private readonly FruitfullDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;

    public UserServices(FruitfullDbContext context, IPasswordHasher<User> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
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
            IsAdmin=false,
            CreatedAt=DateTime.UtcNow,
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return new UserOutputDto
        {
            Email = user.Email,
            Country = user.Country,
            Theme = user.Theme ,
            Nickname = user.Nickname,
            ProfileImage = user.ProfileImage,
            CreatedAt=user.CreatedAt
        };
    }
}