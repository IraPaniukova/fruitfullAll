using Moq;
using fruitfullServer.Models;
using fruitfullServer.DTO.Users;
using fruitfullServer.Services;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth;
using Xunit;

namespace fruitfullTest.ServiceTests;

public class UserServiceTests
{
    private readonly FruitfullDbContext _context;
    private readonly Mock<IPasswordHasher<User>> _mockPasswordHasher;
    private readonly Mock<ILogger<UserService>> _mockLogger;
    private readonly Mock<IGoogleValidator> _mockGoogleValidator;
    private readonly UserService _service;

    public UserServiceTests()
    {
        var options = new DbContextOptionsBuilder<FruitfullDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new FruitfullDbContext(options);
        _mockPasswordHasher = new Mock<IPasswordHasher<User>>();
        _mockPasswordHasher.Setup(h => h.HashPassword(It.IsAny<User>(), It.IsAny<string>()))
                   .Returns("hashed-password");
        _mockLogger = new Mock<ILogger<UserService>>();
        _mockGoogleValidator = new Mock<IGoogleValidator>();
        _service = new UserService(_context, _mockPasswordHasher.Object, _mockLogger.Object, _mockGoogleValidator.Object);
        
    }

     [Fact]
    public async Task CreateUserAsync_WithGoogleToken_CreatesGoogleUser()
    {
        var dto = new UserInputDto
        {
            IdToken = "valid_token"
        };

        var googlePayload = new GoogleJsonWebSignature.Payload
        {
            Email = "google@example.com",
            Subject = "google-id"
        };

        // Setup the mock IGoogleValidator to return the fake payload
        _mockGoogleValidator.Setup(v => v.ValidateAsync("valid_token")).ReturnsAsync(googlePayload);

        // Call CreateUserAsync on the existing _service (which uses _mockGoogleValidator)
        var result = await _service.CreateUserAsync(dto);

        Assert.NotEqual(0, result.UserId);
    }

    [Fact]
    public async Task CreateUserAsync_CreatesLoginUser()
    {
        var dto = new UserInputDto
        {
            Email = "user@example.com",
            Password = "123"
        };

        var result = await _service.CreateUserAsync(dto);

        Assert.NotEqual(0, result.UserId);
        _mockPasswordHasher.Verify(h => h.HashPassword(It.IsAny<User>(), "123"), Times.Once);
    }

    [Fact]
    public async Task CreateUserAsync_MissingPassword_ThrowsException()
    {
        var dto = new UserInputDto
        {
            Email = "user@example.com",
            Password = null!
        };

        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateUserAsync(dto));
    }

    [Fact]
    public async Task UpdateUserLoginAsync_UserMismatch_ThrowsUnauthorized()
    {
        var dto = new UserUpdateLoginDto { Email = "user@example.com", Password = "123" };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.UpdateUserLoginAsync(2, dto, 1));
        // UpdateUserLoginAsync(updatedUserId, dto, currentUserId) – mismatched IDs trigger UnauthorizedAccessException
    }
    [Fact]
    public async Task UpdateUserLoginAsync_UpdatesUserEmail()
    {
        var user = new User
    {
        UserId = 1,
        Email = "user@example.com",
        AuthProvider = "local",
        
    };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        var dto = new UserUpdateLoginDto { Email = "newUser@example.com", Password = "123" };

        var result = await _service.UpdateUserLoginAsync(1, dto, 1);
        Assert.Equal( "newUser@example.com",result.Email);
    }

    [Fact]
    public async Task UpdateUserLoginAsync_ChangesPassword_OldPasswordCorrect_NewPasswordIsNew()
    {
        // Arrange
        var user = new User
        {
            UserId = 1,
            Email = "user@example.com",
            AuthProvider = "local",
            PasswordHash = "hashed-old" // current hashed password in DB
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UserUpdateLoginDto
        {
            Email = "user@example.com",
            Password = "oldpassword",    // user's current plain password input
            NewPassword = "newpassword"  // new password to set
        };

        // Mock VerifyHashedPassword with the old hash and old password
        _mockPasswordHasher
            .Setup(h => h.VerifyHashedPassword(user, "hashed-old", dto.Password))
            .Returns(PasswordVerificationResult.Success);

        // Mock hashing the new password returns new hash
        _mockPasswordHasher
            .Setup(h => h.HashPassword(user, dto.NewPassword))
            .Returns("hashed-new");

        // Act
        var result = await _service.UpdateUserLoginAsync(1, dto, 1);

        // Assert
        Assert.Equal("user@example.com", result.Email);

        var updatedUser = await _context.Users.FindAsync(1);
        Assert.Equal("hashed-new", updatedUser!.PasswordHash);

        _mockPasswordHasher.Verify(h => h.VerifyHashedPassword(user, "hashed-old", dto.Password), Times.Once);
        _mockPasswordHasher.Verify(h => h.HashPassword(user, dto.NewPassword), Times.Once);
    }


    [Fact]
    public async Task UpdateUserLoginAsync_ThrowsException_WhenNewPasswordSameAsOld()
    {
        var user = new User
        {
            UserId = 1,
            Email = "user@example.com",
            AuthProvider = "local",
            PasswordHash = "hashed-old"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UserUpdateLoginDto
        {
            Email = "user@example.com",
            Password = "oldpassword",
            NewPassword = "oldpassword"
        };

        // Verify old password matches
        _mockPasswordHasher.Setup(h => h.VerifyHashedPassword(user, user.PasswordHash!, dto.Password))
            .Returns(PasswordVerificationResult.Success);

        // HashPassword will return same hash for simplicity
        _mockPasswordHasher.Setup(h => h.HashPassword(user, dto.NewPassword))
            .Returns("hashed-old");

        await Assert.ThrowsAsync<ArgumentException>(() => _service.UpdateUserLoginAsync(1, dto, 1));

        _mockPasswordHasher.Verify(h => h.VerifyHashedPassword(user, user.PasswordHash!, dto.Password), Times.Once);
    }

    [Fact]
    public async Task UpdateUserLoginAsync_ThrowsUnauthorized_WhenOldPasswordWrong()
    {
        var user = new User
        {
            UserId = 1,
            Email = "user@example.com",
            AuthProvider = "local",
            PasswordHash = "hashed-old"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UserUpdateLoginDto
        {
            Email = "user@example.com",
            Password = "wrongpassword",
            NewPassword = "newpassword"
        };

        _mockPasswordHasher.Setup(h => h.VerifyHashedPassword(user, user.PasswordHash!, dto.Password))
            .Returns(PasswordVerificationResult.Failed);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.UpdateUserLoginAsync(1, dto, 1));

        _mockPasswordHasher.Verify(h => h.VerifyHashedPassword(user, user.PasswordHash!, dto.Password), Times.Once);
    }

    [Fact]
    public async Task UpdateUserLoginAsync_NonLocalUser_ThrowsInvalidOperation()
    {
        var user = new User { UserId = 1, Email = "x@x.com", AuthProvider = "Google" };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UserUpdateLoginDto { Email = "new@x.com", Password = "pw" };

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.UpdateUserLoginAsync(1, dto, 1));
    }

    [Fact]  // doesnt work yet
    public async Task UpdateUserAsync_NicknameAlreadyExists_Throws()
    {
        _context.Users.AddRange(
            new User { UserId = 1, Nickname = "me" },
            new User { UserId = 2, Nickname = "taken" }
        );
        await _context.SaveChangesAsync();

        var dto = new UserUpdateDto { Nickname = "taken" };

        await Assert.ThrowsAsync<Exception>(() => _service.UpdateUserAsync(1, dto, 1));
    }

    [Fact]
    public async Task UpdateUserAsync_UserMismatch_ThrowsUnauthorized()
    {
        var dto = new UserUpdateDto { Nickname = "any" };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.UpdateUserAsync(2, dto, 1));
    }
}
