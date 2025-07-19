using fruitfullServer.DTO.Posts;
using fruitfullServer.Models;
using fruitfullServer.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace fruitfullTest.ServiceTests;

public class PostServiceTests
{
    private readonly FruitfullDbContext _context;
    private readonly Mock<ILogger<PostService>> _mockLogger;
    private readonly Mock<TagService> _mockTagService;
    private readonly PostService _service;

    public PostServiceTests()
    {
        var options = new DbContextOptionsBuilder<FruitfullDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new FruitfullDbContext(options);

        _mockLogger = new Mock<ILogger<PostService>>();
        _mockTagService = new Mock<TagService>(_context, new Mock<ILogger<TagService>>().Object);

        _service = new PostService(_context, _mockLogger.Object, _mockTagService.Object);
    }

    private Post MockExistingPost(List<Tag>? tags = null)
    {
        return new Post
        {
            Content = "abc",
            Opinion = "opinion",
            Company = "TestCo",
            Industry = "IT",
            Year = DateTime.UtcNow.Year,
            Country = "NZ",
            StressLevel = 3,
            QuestionType = "Tech",
            InterviewFormat = "Online",
            UserId = 1,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false,
            Tags = tags ?? []
        };
    }

    [Fact]
    public async Task CreatePostAsync_CreatesPost()
    {
        var dto = new PostInputDto
        {
            Content = "test",
            Company = "c",
            Industry = "i",
            Year = DateTime.UtcNow.Year,
            Country = "NZ",
            StressLevel = 3,
            QuestionType = "t",
            InterviewFormat = "online",
            Tags = ["t1"]
        };

        _mockTagService.Setup(t => t.AssignTagsToPostAsync(It.IsAny<int>(), dto.Tags)).Returns(Task.CompletedTask);

        var result = await _service.CreatePostAsync(dto, 1);

        Assert.NotNull(result);
        Assert.Equal("test", result.Content);
    }

    [Fact]
    public async Task UpdatePostAsync_UpdatesFields()
    {

        var post = MockExistingPost();
        var user = new User { UserId = post.UserId, Nickname = "TestUser" };
        _context.Users.Add(user);
        post.User = user;  // assign the navigation property
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        var dto = new PostUpdateDto
        {
            Content = "new",
            Tags = ["t1"]
        };

        _mockTagService.Setup(t => t.DeleteAllTagsFromPostAsync(post.PostId)).Returns(Task.CompletedTask);
        _mockTagService.Setup(t => t.AssignTagsToPostAsync(post.PostId, dto.Tags!)).Returns(Task.CompletedTask);

        var updated = await _service.UpdatePostAsync(post.PostId, dto, post.UserId);

        Assert.Equal("new", updated.Content);
    }


    [Fact]
    public async Task DeletePostAsync_MarksDeleted()
    {
        var post = MockExistingPost();
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        await _service.DeletePostAsync(post.PostId, post.UserId);

        var deleted = await _context.Posts.FindAsync(post.PostId);
        Assert.True(deleted!.IsDeleted);
    }

    [Fact]
    public async Task ToggleLikePostAsync_TogglesLike()
    {
        var post = MockExistingPost();
        var user = new User { UserId = 10, Email = "a@b.com", PasswordHash = "pw" };

        _context.Posts.Add(post);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var like = await _service.ToggleLikePostAsync(post.PostId, user.UserId);
        Assert.Equal(1, like.LikesCount);

        var unlike = await _service.ToggleLikePostAsync(post.PostId, user.UserId);
        Assert.Equal(0, unlike.LikesCount);
    }
    [Fact]
    public async Task GetPostByIdAsync_ReturnsPostWithUserInfo()
    {
        
        var user = new User { UserId = 1, Nickname = "TestUser", ProfileImage = "image.png" };
        var post = new Post
        {
            PostId = 1,
            Content = "Test content",
            UserId = 1,
            User = user,
            Tags = new List<Tag> { new Tag { Name = "test" } },
            Company = "TestCompany",
            Country = "TestCountry",
            Industry = "TestIndustry",
            InterviewFormat = "TestFormat",
            QuestionType = "TestQuestion"
        };


        _context.Users.Add(user);
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        var result = await _service.GetPostByIdAsync(1);

        Assert.NotNull(result);
        Assert.Equal("TestUser", result.Nickname);
        Assert.Equal("image.png", result.ProfileImage);
        Assert.Contains("test", result.Tags);
    }

}
