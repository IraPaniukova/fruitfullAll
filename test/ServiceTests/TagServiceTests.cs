using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using fruitfullServer.Models;
using fruitfullServer.Services;
using Microsoft.EntityFrameworkCore;

namespace fruitfullTest.ServiceTests;

public class TagServiceTests
{
    private readonly FruitfullDbContext _context;
    private readonly Mock<ILogger<TagService>> _mockLogger;
    private readonly TagService _service;

    public TagServiceTests()
    {
        var options = new DbContextOptionsBuilder<FruitfullDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new FruitfullDbContext(options);
        _mockLogger = new Mock<ILogger<TagService>>();
        _service = new TagService(_context, _mockLogger.Object);
    }

    private Post MockExistingPost()
    {
        return new Post
        {
            Content = "abc",
            Opinion = "opinion",
            Company = "TestCo",
            Industry = "IT",
            Year = 2025,
            Country = "NZ",
            StressLevel = 1,
            QuestionType = "Tech",
            InterviewFormat = "Online",
            UserId = 1,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false,
            Tags = []
        };
    }

    [Fact]
    public async Task CreateOrFindTagAsync_CreatesOrReturnsTag()
    {
        var result1 = await _service.CreateOrFindTagAsync("newTag");
        var result2 = await _service.CreateOrFindTagAsync("newTag");

        Assert.Equal(result1.TagId, result2.TagId);
        Assert.Equal("newtag", result1.Name);
    }

    [Fact]
    public async Task CreateTagsAsync_HandlesMultipleTags()
    {
        var result = await _service.CreateTagsAsync(["a", "b"]);
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task CreateTagsAsync_ThrowsOnEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateTagsAsync([]));
    }

    [Fact]
    public async Task ConnectTagToPostAsync_AddsTag()
    {
        var post = MockExistingPost();
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        await _service.ConnectTagToPostAsync(post.PostId, "TagA");
        var updated = await _context.Posts.Include(p => p.Tags).FirstAsync();

        Assert.Single(updated.Tags);
        Assert.Equal("taga", updated.Tags.First().Name);
    }

    [Fact]
    public async Task AssignTagsToPostAsync_AddsTags()
    {
        var post = MockExistingPost();
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        await _service.AssignTagsToPostAsync(post.PostId, ["x", "y"]);
        var updated = await _context.Posts.Include(p => p.Tags).FirstAsync();

        Assert.Equal(2, updated.Tags.Count);
    }

    [Fact]
    public async Task DeleteAllTagsFromPostAsync_RemovesTags()
    {
        var tag = new Tag { Name = "one" };
        var post = MockExistingPost();
        _context.Tags.Add(tag);
        post.Tags.Add(tag);

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        await _service.DeleteAllTagsFromPostAsync(post.PostId);

        var updated = await _context.Posts.Include(p => p.Tags).FirstAsync();
        Assert.Empty(updated.Tags);
    }
}
