using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using fruitfullServer.Controllers;
using fruitfullServer.Models;
using fruitfullServer.Services;
using fruitfullServer.DTO.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

public class UsersControllerTests
{
    private readonly Mock<FruitfullDbContext> _mockContext;
    private readonly Mock<UserService> _mockUserService;
    private readonly UsersController _controller;

    public UsersControllerTests()
    {
         _mockContext = new Mock<FruitfullDbContext>();
        var mockContext = new Mock<FruitfullDbContext>();
        var mockPasswordHasher = new Mock<IPasswordHasher<User>>();
        var mockLogger = new Mock<ILogger<UserService>>();
        var mockGoogleValidator = new Mock<IGoogleValidator>();

            _mockUserService = new Mock<UserService>(
                mockContext.Object,
                mockPasswordHasher.Object,
                mockLogger.Object,
                mockGoogleValidator.Object);
        _controller = new UsersController(_mockContext.Object, _mockUserService!.Object);
        SetupUserContext(_controller, userId: 1, roles: ["SuperAdmin"]);
    }

    private static void SetupUserContext(ControllerBase controller, int userId, string[] roles)
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, "testuser"),
        }.Concat(roles.Select(role => new Claim(ClaimTypes.Role, role))), "mock"));

        controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
    }

    private static Mock<DbSet<User>> CreateMockDbSet(IEnumerable<User> users)
    {
        var queryable = users.AsQueryable();
        var mockSet = new Mock<DbSet<User>>();
        mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(queryable.Provider);
        mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(queryable.Expression);
        mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
        mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());
        return mockSet;
    }

    [Fact]
    public async Task GetUsers_ReturnsOkWithUserList()
    {
        var users = new List<User>
        {
            new User { UserId = 1, Nickname = "User1" },
            new User { UserId = 2, Nickname = "User2" }
        };
        var mockSet = CreateMockDbSet(users);
        _mockContext.Setup(c => c.Users).Returns(mockSet.Object);

        var result = await _controller.GetUsers();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnUsers = Assert.IsAssignableFrom<IEnumerable<UserOutputDto>>(okResult.Value);
        Assert.Equal(2, returnUsers.Count());
    }

//     [Fact]
//     public async Task GetUser_ReturnsOkWithUser_WhenExists()
//     {
//         var user = new User { UserId = 1, Nickname = "User1" };
//         _mockContext.Setup(c => c.Users.FindAsync(1)).ReturnsAsync(user);

//         var result = await _controller.GetUser(1);

//         var okResult = Assert.IsType<OkObjectResult>(result.Result);
//         var returnUser = Assert.IsType<UserOutputDto>(okResult.Value);
//         Assert.Equal(1, returnUser.UserId);
//     }

//     [Fact]
//     public async Task GetUser_ReturnsNotFound_WhenUserDoesNotExist()
//     {
//         _mockContext.Setup(c => c.Users.FindAsync(1)).ReturnsAsync((User?)null);

//         var result = await _controller.GetUser(1);

//         Assert.IsType<NotFoundResult>(result.Result);
//     }

//     [Fact]
//     public async Task PostUser_ReturnsCreated_WhenSuccessful()
//     {
//         var input = new UserInputDto { Email = "test@test.com" };
//         var output = new UserOutputDto { UserId = 1, Nickname = "Test" };
// var expectedUserOutputDto = new UserOutputDto
// {
//     UserId = 1,
//     Country = "NZ",
//     Theme = "light",
//     Nickname = "Tester",
//     ProfileImage = null,
//     CreatedAt = DateTime.UtcNow
// };
//         _mockUserService.Setup(s => s.CreateUserAsync(input)).ReturnsAsync(expectedUserOutputDto);


//         var result = await _controller.PostUser(input);

//         var createdAtAction = Assert.IsType<CreatedAtActionResult>(result.Result);
//         Assert.Equal(nameof(_controller.GetUser), createdAtAction.ActionName);
//         var userOutput = Assert.IsType<UserOutputDto>(createdAtAction.Value);
//     Assert.Equal(1, userOutput.UserId);
//     }

//     [Fact]
//     public async Task PostUser_ReturnsBadRequest_OnDbUpdateException()
//     {
//         var input = new UserInputDto { Email = "test@test.com" };

//         _mockUserService.Setup(s => s.CreateUserAsync(input))
//             .ThrowsAsync(new DbUpdateException("DB error"));

//         var result = await _controller.PostUser(input);

//         var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
//         Assert.Contains("Unable to save user", badRequest.Value?.ToString());
//     }

//     [Fact]
//     public async Task PutUser_ReturnsNoContent_WhenSuccessful()
//     {
//         var updateDto = new UserUpdateDto { Nickname = "Updated" };
//         _mockUserService.Setup(s => s.UpdateUserAsync(1, updateDto, It.IsAny<int>())).ReturnsAsync(new UserOutputDto { UserId = 1 });

//         var result = await _controller.PutUser(1, updateDto);

//         Assert.IsType<NoContentResult>(result);
//     }

//     [Fact]
//     public async Task PutUser_ReturnsNotFound_WhenKeyNotFoundExceptionThrown()
//     {
//         var updateDto = new UserUpdateDto();
//         _mockUserService.Setup(s => s.UpdateUserAsync(1, updateDto, It.IsAny<int>()))
//             .ThrowsAsync(new KeyNotFoundException());

//         var result = await _controller.PutUser(1, updateDto);

//         Assert.IsType<NotFoundResult>(result);
//     }

//     [Fact]
//     public async Task PutUserLoginData_ReturnsOk_WhenSuccessful()
//     {
//         var loginDto = new UserUpdateLoginDto { Email = "test@test.com" };
//         var output = new UserOutputLoginDto { UserId = 1, Email = "test@test.com" };

//         _mockUserService.Setup(s => s.UpdateUserLoginAsync(1, loginDto, It.IsAny<int>())).ReturnsAsync(output);

//         var result = await _controller.PutUserLoginData(1, loginDto);

//         var okResult = Assert.IsType<OkObjectResult>(result);
//         var returned = Assert.IsType<UserOutputLoginDto>(okResult.Value);
//         Assert.Equal(1, returned.UserId);
//     }

//     [Fact]
//     public async Task PutUserLoginData_ReturnsBadRequest_WhenInvalidOperationExceptionThrown()
//     {
//         var loginDto = new UserUpdateLoginDto();

//         _mockUserService.Setup(s => s.UpdateUserLoginAsync(1, loginDto, It.IsAny<int>()))
//             .ThrowsAsync(new InvalidOperationException("Invalid operation"));

//         var result = await _controller.PutUserLoginData(1, loginDto);

//         var badRequest = Assert.IsType<BadRequestObjectResult>(result);
//         Assert.Equal("Invalid operation", badRequest.Value);
//     }

//     [Fact]
//     public async Task DeleteUser_ReturnsNoContent_WhenSuccessful()
//     {
//         var user = new User { UserId = 1 };
//         _mockContext.Setup(c => c.Users.FindAsync(1)).ReturnsAsync(user);
//         _mockContext.Setup(c => c.Users.Remove(user));
//         _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

//         var result = await _controller.DeleteUser(1);

//         Assert.IsType<NoContentResult>(result);
//     }

//     [Fact]
//     public async Task DeleteUser_ReturnsForbidden_WhenNotSuperAdminAndDeletingOtherUser()
//     {
//         SetupUserContext(_controller, userId: 2, roles: ["User"]); // Not SuperAdmin, different user

//         var user = new User { UserId = 1 };
//         _mockContext.Setup(c => c.Users.FindAsync(1)).ReturnsAsync(user);

//         var result = await _controller.DeleteUser(1);

//         Assert.IsType<ForbidResult>(result);
//     }

//     [Fact]
//     public async Task DeleteUser_ReturnsNotFound_WhenUserNotFound()
//     {
//         _mockContext.Setup(c => c.Users.FindAsync(1)).ReturnsAsync((User?)null);

//         var result = await _controller.DeleteUser(1);

//         Assert.IsType<NotFoundResult>(result);
//     }
}
