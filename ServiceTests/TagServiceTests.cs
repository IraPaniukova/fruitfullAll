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
     private Post MockExistingPost(List<Tag>? tags = null)
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
            Tags =  []
        };
    }

    [Fact]
    public async Task CreateOrFindTagAsync_CreatesNewTag()
    {
        var result = await _service.CreateOrFindTagAsync("newTag");

        Assert.NotEqual(0, result.TagId);
        Assert.Equal("newTag", result.Name);
    }

    [Fact]
    public async Task CreateOrFindTagAsync_ReturnsExistingTag()
    {
        _context.Tags.Add(new Tag { Name = "existing" });
        await _context.SaveChangesAsync();

        var result = await _service.CreateOrFindTagAsync("existing");

        Assert.Equal("existing", result.Name);
    }

    [Fact]
    public async Task CreateTagsAsync_CreatesMultipleTags()
    {
        var tags = new List<string> { "a", "b" };
        var result = await _service.CreateTagsAsync(tags);

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task CreateTagsAsync_Throws_WhenListEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateTagsAsync([]));
    }

    [Fact]
    public async Task GetTagsAsync_ReturnsAllTags()
    {
        _context.Tags.AddRange(new Tag { Name = "1" }, new Tag { Name = "2" });
        await _context.SaveChangesAsync();

        var result = await _service.GetTagsAsync();

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task ConnectTagToPostAsync_AddsTagToPost()
    {
        // Arrange
        var post = MockExistingPost();
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        // Act
        await _service.ConnectTagToPostAsync(post.PostId, "Tnew");

        // Assert (no need to call SaveChanges here — the tag is already saved by CreateOrFindTagAsync)
        var updated = await _context.Posts.Include(p => p.Tags).FirstAsync(p => p.PostId == post.PostId);
        Assert.Single(updated.Tags);
        Assert.Equal("Tnew", updated.Tags.First().Name);
    }

    [Fact]
    public async Task AssignTagsToPostAsync_AddsMultipleTags()
    {
        var post = MockExistingPost();
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        await _service.AssignTagsToPostAsync(post.PostId, ["a", "b"]);

        var updated = await _context.Posts.Include(p => p.Tags).FirstAsync();
        Assert.Equal(2, updated.Tags.Count);
    }

    [Fact]
    public async Task AssignTagsToPostAsync_Throws_WhenEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.AssignTagsToPostAsync(1, []));
    }

    [Fact]
    public async Task AssignTagsToPostAsync_Throws_WhenNull()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.AssignTagsToPostAsync(1, null!));
    }

    [Fact]
    public async Task AssignTagsToPostAsync_Throws_WhenTagEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.AssignTagsToPostAsync(1, [""]));
    }

    [Fact]
    public async Task DeleteAllTagsFromPostAsync_RemovesAllTags()
    {
        var tag = new Tag { Name = "x" };
        var post = MockExistingPost();
        _context.Tags.Add(tag);
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        await _service.DeleteAllTagsFromPostAsync(post.PostId);

        var updated = await _context.Posts.Include(p => p.Tags).FirstAsync();
        Assert.Empty(updated.Tags);
    }
}
