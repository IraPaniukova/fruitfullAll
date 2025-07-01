using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using fruitfullServer.Models;
using fruitfullServer.DTO.Auth;
using fruitfullServer.DTO.Users;

namespace fruitfullServer.Services;

public class AuthService
{
    private readonly FruitfullDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ILogger<AuthService> _logger;
    private readonly IConfiguration _config;

    public AuthService(
        FruitfullDbContext context,
        IPasswordHasher<User> passwordHasher,
        ILogger<AuthService> logger,
        IConfiguration config)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
        _config = config;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email) ?? throw new UnauthorizedAccessException("Invalid email or password");
            
            if (string.IsNullOrEmpty(user.PasswordHash)) throw new Exception("User password hash is missing."); 
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result != PasswordVerificationResult.Success)
                throw new UnauthorizedAccessException("Invalid email or password");

            return await GenerateTokensAsync(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login failed");
            throw;
        }
    }

    private static string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString().Replace("-", "");
        //dashes don't add security, removing them makes the code cleaner
    }
    private async Task<AuthResponseDto> GenerateTokensAsync(User user)
    {
        var token = CreateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        var authToken = new AuthToken
        {
            UserId = user.UserId,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            RevokedAt = null
        };

        _context.AuthTokens.Add(authToken);
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = authToken.ExpiresAt
        };
    }

    private static string CreateJwtToken(User user)
    {
        var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
        
        if (string.IsNullOrEmpty(jwtKey)) throw new Exception("JWT Key is not configured.");
        if (string.IsNullOrEmpty(jwtIssuer)) throw new Exception("JWT Issuer is not configured.");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtIssuer,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<UserIdDto> CancelTokenAsync(RefreshTokenRequest request)
    {
        try
        {
            var token = await _context.AuthTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.RefreshToken == request.RefreshToken && t.RevokedAt == null);

            if (token == null || token.ExpiresAt < DateTime.UtcNow)
                throw new UnauthorizedAccessException("Invalid or expired refresh token");

            // var user = (token.User ?? await _context.Users.FindAsync(token.UserId)) ??
            //         throw new UnauthorizedAccessException("User not found");
            token.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return new UserIdDto{UserId=token.UserId};
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Canceling token failed");
            throw;
        }
    }
    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequest request)
    {
        try
        {       
            var userDto = await CancelTokenAsync(request);
            var user = await _context.Users.FindAsync(userDto.UserId);
            if (user == null) throw new UnauthorizedAccessException("User not found");
            var newTokens = await GenerateTokensAsync(user);
            return newTokens;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Refresh token failed");
            throw;
        }
    }
}
