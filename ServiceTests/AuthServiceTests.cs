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

        // Setup config for JWT keys
        _mockConfig.Setup(c => c[It.Is<string>(s => s == "JWT_SECRET_KEY")])
            .Returns("supersecretkeysupersecretkeysupersecretkey1234"); // 32+ chars
        _mockConfig.Setup(c => c[It.Is<string>(s => s == "JWT_ISSUER")])
            .Returns("testissuer");

        _service = new AuthService(_context, _mockHasher.Object, _mockLogger.Object, _mockConfig.Object, _mockGoogleValidator.Object);
    }

    [Fact]
    public async Task LoginWithGoogleAsync_ReturnsTokens_WhenValid()
    {
        // Arrange
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

        // Act
        var result = await _service.LoginWithGoogleAsync("valid_token");

        // Assert
        Assert.NotNull(result.Token);
        Assert.NotNull(result.RefreshToken);
        Assert.True(result.ExpiresAt > DateTime.UtcNow);
    }

    [Fact]
    public async Task LoginWithEmailAsync_ReturnsTokens_WhenCredentialsValid()
    {
        // Arrange
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

        // Act
        var result = await _service.LoginWithEmailAsync(dto);

        // Assert
        Assert.NotNull(result.Token);
        Assert.NotNull(result.RefreshToken);
        Assert.True(result.ExpiresAt > DateTime.UtcNow);
    }

    [Fact]
    public async Task CancelTokenAsync_Throws_WhenTokenNotFound()
    {
        // Arrange
        var request = new RefreshTokenRequest { RefreshToken = "invalid" };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.CancelTokenAsync(request));
    }

    [Fact]
    public async Task RefreshTokenAsync_ReturnsNewTokens_WhenValid()
    {
        // Arrange
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

        // Act
        var result = await _service.RefreshTokenAsync(request);

        // Assert
        Assert.NotNull(result.Token);
        Assert.NotEqual(token.RefreshToken, result.RefreshToken);
    }
}

