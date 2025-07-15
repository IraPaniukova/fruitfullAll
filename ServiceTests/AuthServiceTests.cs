using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using fruitfullServer.Services;
using fruitfullServer.Models;
using fruitfullServer.DTO.Auth;
using Google.Apis.Auth;

namespace fruitfullTest.ServiceTests;

public class AuthServiceTests
{
    private readonly FruitfullDbContext _context;
    private readonly Mock<IPasswordHasher<User>> _mockHasher;
    private readonly Mock<ILogger<AuthService>> _mockLogger;
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly Mock<IGoogleValidator> _mockGoogleValidator;
    private readonly AuthService _service;

    public AuthServiceTests()
    {
        var options = new DbContextOptionsBuilder<FruitfullDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new FruitfullDbContext(options);

        _mockHasher = new Mock<IPasswordHasher<User>>();
        _mockLogger = new Mock<ILogger<AuthService>>();
        _mockConfig = new Mock<IConfiguration>();
        _mockGoogleValidator = new Mock<IGoogleValidator>();
        Environment.SetEnvironmentVariable("JWT_SECRET_KEY", "supersecretkeysupersecretkeysupersecretkey1234");
        Environment.SetEnvironmentVariable("JWT_ISSUER", "testissuer");

        _service = new AuthService(
            _context,
            _mockHasher.Object,
            _mockLogger.Object,
            _mockConfig.Object,
            _mockGoogleValidator.Object);
    }

    [Fact]
    public async Task AuthenticateWithGoogleAsync_ReturnsTokens_WhenValid()
    {
        var googlePayload = new GoogleJsonWebSignature.Payload
        {
            Email = "testgoogle@example.com",
            Subject = "google123"
        };

        _mockGoogleValidator.Setup(v => v.ValidateAsync(It.IsAny<string>()))
            .ReturnsAsync(googlePayload);

        var user = new User
        {
            Email = googlePayload.Email,
            GoogleId = googlePayload.Subject,
            AuthProvider = "Google"
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var result = await _service.AuthenticateWithGoogleAsync("valid_token");

        Assert.NotNull(result.Token);
        Assert.NotNull(result.RefreshToken);
        Assert.True(result.ExpiresAt > DateTime.UtcNow);
    }

    [Fact]
    public async Task LoginWithEmailAsync_ReturnsTokens_WhenCredentialsValid()
    {
        var user = new User
        {
            Email = "test@example.com",
            PasswordHash = "hashed",
            AuthProvider = "Email"
        };
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        _mockHasher.Setup(h => h.VerifyHashedPassword(user, user.PasswordHash, "1234"))
            .Returns(PasswordVerificationResult.Success);

        var dto = new LoginDto { Email = user.Email, Password = "1234" };

        var result = await _service.LoginWithEmailAsync(dto);

        Assert.NotNull(result.Token);
        Assert.NotNull(result.RefreshToken);
        Assert.True(result.ExpiresAt > DateTime.UtcNow);
    }

    [Fact]
    public async Task CancelTokenAsync_Throws_WhenTokenNotFound()
    {
        var request = new RefreshTokenRequest { RefreshToken = "invalid" };
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.CancelTokenAsync(request));
    }

    [Fact]
    public async Task RefreshTokenAsync_ReturnsNewTokens_WhenValid()
    {
        var user = new User { Email = "user@test.com" };
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var token = new AuthToken
        {
            UserId = user.UserId,
            RefreshToken = "refresh123",
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            CreatedAt = DateTime.UtcNow
        };
        await _context.AuthTokens.AddAsync(token);
        await _context.SaveChangesAsync();

        var request = new RefreshTokenRequest { RefreshToken = token.RefreshToken };

        var result = await _service.RefreshTokenAsync(request);

        Assert.NotNull(result.Token);
        Assert.NotEqual(token.RefreshToken, result.RefreshToken);
    }

    [Fact]
    public async Task AuthenticateWithGoogleAsync_Throws_WhenInvalidGoogleToken()
    {
        _mockGoogleValidator.Setup(v => v.ValidateAsync(It.IsAny<string>()))
            .ReturnsAsync((GoogleJsonWebSignature.Payload?)null);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _service.AuthenticateWithGoogleAsync("invalid_token"));
    }

    [Fact]
    public async Task AuthenticateWithGoogleAsync_Throws_WhenExistingEmailConflict()
    {
        var googlePayload = new GoogleJsonWebSignature.Payload
        {
            Email = "existing@example.com",
            Subject = "google123"
        };

        _mockGoogleValidator.Setup(v => v.ValidateAsync(It.IsAny<string>()))
            .ReturnsAsync(googlePayload);

        var existingUser = new User
        {
            Email = googlePayload.Email,
            AuthProvider = null  // traditional user
        };
        await _context.Users.AddAsync(existingUser);
        await _context.SaveChangesAsync();

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.AuthenticateWithGoogleAsync("valid_token"));
    }

    [Fact]
    public async Task LoginWithEmailAsync_Throws_WhenUserNotFound()
    {
        var dto = new LoginDto { Email = "notfound@example.com", Password = "1234" };
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.LoginWithEmailAsync(dto));
    }

    [Fact]
    public async Task LoginWithEmailAsync_Throws_WhenWrongPassword()
    {
        var user = new User
        {
            Email = "test@example.com",
            PasswordHash = "hashed",
            AuthProvider = "Email"
        };
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        _mockHasher.Setup(h => h.VerifyHashedPassword(user, user.PasswordHash, "wrongpass"))
            .Returns(PasswordVerificationResult.Failed);

        var dto = new LoginDto { Email = user.Email, Password = "wrongpass" };
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.LoginWithEmailAsync(dto));
    }

    [Fact]
    public async Task LoginWithEmailAsync_Throws_WhenPasswordHashMissing()
    {
        var user = new User
        {
            Email = "test@example.com",
            PasswordHash = null,
            AuthProvider = "Email"
        };
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var dto = new LoginDto { Email = user.Email, Password = "1234" };
        await Assert.ThrowsAsync<Exception>(() => _service.LoginWithEmailAsync(dto));
    }

    [Fact]
    public async Task CancelTokenAsync_Succeeds_WhenValidToken()
    {
        var user = new User { Email = "user@test.com" };
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var token = new AuthToken
        {
            UserId = user.UserId,
            RefreshToken = "validtoken",
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            CreatedAt = DateTime.UtcNow
        };
        await _context.AuthTokens.AddAsync(token);
        await _context.SaveChangesAsync();

        var request = new RefreshTokenRequest { RefreshToken = token.RefreshToken };
        var result = await _service.CancelTokenAsync(request);

        Assert.Equal(user.UserId, result.UserId);

        // Check token revoked
        var revokedToken = await _context.AuthTokens.FirstAsync(t => t.RefreshToken == token.RefreshToken);
        Assert.NotNull(revokedToken.RevokedAt);
    }

    [Fact]
    public async Task RefreshTokenAsync_Throws_WhenUserNotFoundAfterCancel()
    {
        var token = new AuthToken
        {
            UserId = 9999, // nonexistent user id
            RefreshToken = "refresh123",
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            CreatedAt = DateTime.UtcNow
        };
        await _context.AuthTokens.AddAsync(token);
        await _context.SaveChangesAsync();

        var request = new RefreshTokenRequest { RefreshToken = token.RefreshToken };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.RefreshTokenAsync(request));
    }

}
