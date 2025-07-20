using fruitfullServer.Models;
using fruitfullServer.DTO.Users;
using fruitfullServer.Services;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace fruitfullTest.ServiceTests;

public class UserServiceTests

{
    private readonly FruitfullDbContext _context;
    private readonly Mock<IPasswordHasher<User>> _mockPasswordHasher;
    private readonly Mock<ILogger<UserService>> _mockLogger;
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
        _service = new UserService(_context, _mockPasswordHasher.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task CreateUserAsync_CreatesUser()
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
    public async Task CreateUserAsync_MissingPassword_Throws()
    {
        var dto = new UserInputDto
        {
            Email = "user@example.com",
            Password = null!
        };

        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateUserAsync(dto));
    }

    [Fact]
    public async Task UpdateUserLoginAsync_UpdatesEmail()
    {
        var user = new User
        {
            UserId = 1,
            Email = "user@example.com",
            AuthProvider = "local"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UserUpdateLoginDto { Email = "new@example.com" };

        var result = await _service.UpdateUserLoginAsync(dto, 1);

        Assert.Equal("new@example.com", result.Email);
    }

    [Fact]
    public async Task UpdateUserLoginAsync_ChangesPassword()
    {
        var user = new User
        {
            UserId = 1,
            Email = "user@example.com",
            AuthProvider = "local",
            PasswordHash = "oldhash"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UserUpdateLoginDto
        {
            Email = "user@example.com",
            Password = "oldpw",
            NewPassword = "newpw"
        };

        _mockPasswordHasher.Setup(h => h.VerifyHashedPassword(user, "oldhash", "oldpw"))
            .Returns(PasswordVerificationResult.Success);

        _mockPasswordHasher.Setup(h => h.HashPassword(user, "newpw"))
            .Returns("newhash");

        var result = await _service.UpdateUserLoginAsync(dto, 1);

        Assert.Equal("user@example.com", result.Email);
        Assert.Equal("newhash", user.PasswordHash);
    }

    [Fact]
    public async Task UpdateUserLoginAsync_WrongPassword_Throws()
    {
        var user = new User
        {
            UserId = 1,
            Email = "user@example.com",
            AuthProvider = "local",
            PasswordHash = "oldhash"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UserUpdateLoginDto
        {
            Password = "wrongpw",
            NewPassword = "newpw"
        };

        _mockPasswordHasher.Setup(h => h.VerifyHashedPassword(user, "oldhash", "wrongpw"))
            .Returns(PasswordVerificationResult.Failed);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.UpdateUserLoginAsync(dto, 1));
    }

    [Fact]
    public async Task UpdateUserAsync_NicknameExists_Throws()
    {
        _context.Users.AddRange(
            new User { UserId = 1, Nickname = "me" },
            new User { UserId = 2, Nickname = "taken" }
        );
        await _context.SaveChangesAsync();

        var dto = new UserUpdateDto { Nickname = "taken" };

        await Assert.ThrowsAsync<Exception>(() => _service.UpdateUserAsync(dto, 1));
    }
}
