using fruitfullServer.DTO.Auth;
using fruitfullServer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace fruitfullServer.Services;

public class AuthService
{
    private readonly FruitfullDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(FruitfullDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<AuthResponseDto> AuthenticateAsync(LoginDto dto)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null || user.PasswordHash != dto.Password) // Replace with proper hashing check
            throw new UnauthorizedAccessException("Invalid credentials");

        var token = GenerateJwtToken(user, out DateTime expiresAt);
        var refreshToken = GenerateRefreshToken();

        var authToken = new AuthToken
        {
            UserId = user.UserId,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };

        _context.AuthTokens.Add(authToken);
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt
        };
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var storedToken = await _context.AuthTokens
            .FirstOrDefaultAsync(t => t.RefreshToken == request.RefreshToken && t.RevokedAt == null);

        if (storedToken == null || storedToken.ExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Invalid or expired refresh token");

        var user = await _context.Users.FindAsync(storedToken.UserId);
        if (user == null)
            throw new Exception("User not found");

        var newJwt = GenerateJwtToken(user, out DateTime expiresAt);
        var newRefresh = GenerateRefreshToken();

        storedToken.RevokedAt = DateTime.UtcNow;

        _context.AuthTokens.Add(new AuthToken
        {
            UserId = user.UserId,
            RefreshToken = newRefresh,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });

        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = newJwt,
            RefreshToken = newRefresh,
            ExpiresAt = expiresAt
        };
    }

    private string GenerateJwtToken(User user, out DateTime expiresAt)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        expiresAt = DateTime.UtcNow.AddMinutes(30);
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }
}
