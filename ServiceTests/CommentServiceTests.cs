using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using fruitfullServer.Models;
using fruitfullServer.Services;
using fruitfullServer.DTO.Comments;

namespace fruitfullTest.ServiceTests;

public class CommentServiceTests
{
    private readonly FruitfullDbContext _context;
    private readonly CommentService _service;

    public CommentServiceTests()
    {
        var options = new DbContextOptionsBuilder<FruitfullDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new FruitfullDbContext(options);
        var logger = Mock.Of<ILogger<CommentService>>();
        _service = new CommentService(_context, logger);
    }

    private static Comment MockExistingComment(int userId = 1, int postId = 1)
    {
        return new Comment
        {
            PostId = postId,
            UserId = userId,
            Text = "Test comment",
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false,
            LikesCount = 0
        };
    }

    [Fact]
    public async Task CreateCommentAsync_CreatesAndReturnsComment()
    {
        var dto = new CommentInputDto { PostId = 1, Text = "Hello" };
        var result = await _service.CreateCommentAsync(dto, 1);

        Assert.Equal(dto.Text, result.Text);
        Assert.Equal(dto.PostId, result.PostId);
        Assert.Equal(1, result.UserId);

        var dbComment = await _context.Comments.FindAsync(result.CommentId);
        Assert.NotNull(dbComment);
    }

  [Fact]
    public async Task GetCommentByIdAsync_ReturnsComment_WhenExists()
    {
        var testUser = new User
        {
            UserId = 1,
            Nickname = "TestUserNick",
            Email = "test@example.com",
            ProfileImage = "test_profile.jpg"
        };
        await _context.Users.AddAsync(testUser);
        await _context.SaveChangesAsync();

        var comment = MockExistingComment(userId: testUser.UserId); 
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        var result = await _service.GetCommentByIdAsync(comment.CommentId);

        Assert.NotNull(result);
        Assert.Equal(comment.Text, result!.Text);
        Assert.Equal(comment.CommentId, result.CommentId);
        Assert.Equal(comment.PostId, result.PostId);
        Assert.Equal(comment.UserId, result.UserId);
        Assert.Equal(testUser.Nickname, result.Nickname); 
        Assert.Equal(testUser.ProfileImage, result.ProfileImage); 
        Assert.False(result.IsDeleted); 
        Assert.Equal(comment.LikesCount, result.LikesCount);
    }

    [Fact]
    public async Task GetCommentByIdAsync_ReturnsNull_WhenNotFound()
    {
        var result = await _service.GetCommentByIdAsync(999);
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateCommentAsync_UpdatesText_WhenAuthorized()
    {
        var comment = MockExistingComment(userId: 1);
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        var dto = new CommentUpdateDto { Text = "Updated text" };
        var result = await _service.UpdateCommentAsync(comment.CommentId, dto, 1);

        Assert.Equal(dto.Text, result.Text);
        Assert.NotNull(result.UpdatedAt);

        var dbComment = await _context.Comments.FindAsync(comment.CommentId);
        Assert.Equal(dto.Text, dbComment!.Text);
    }

    [Fact]
    public async Task UpdateCommentAsync_ThrowsUnauthorized_WhenUserMismatch()
    {
        var comment = MockExistingComment(userId: 1);
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        var dto = new CommentUpdateDto { Text = "Updated text" };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.UpdateCommentAsync(comment.CommentId, dto, 2));
    }

    [Fact]
    public async Task UpdateCommentAsync_ThrowsKeyNotFound_WhenCommentMissing()
    {
        var dto = new CommentUpdateDto { Text = "Updated text" };
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.UpdateCommentAsync(999, dto, 1));
    }

    [Fact]
    public async Task DeleteCommentAsync_SetsIsDeleted_WhenAuthorized()
    {
        var comment = MockExistingComment(userId: 1);
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        await _service.DeleteCommentAsync(comment.CommentId, 1);

        var dbComment = await _context.Comments.FindAsync(comment.CommentId);
        Assert.True(dbComment!.IsDeleted);
    }

    [Fact]
    public async Task DeleteCommentAsync_ThrowsUnauthorized_WhenUserMismatch()
    {
        var comment = MockExistingComment(userId: 1);
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.DeleteCommentAsync(comment.CommentId, 2));
    }

    [Fact]
    public async Task DeleteCommentAsync_ThrowsKeyNotFound_WhenCommentMissing()
    {
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.DeleteCommentAsync(999, 1));
    }

    [Fact]
    public async Task GetCommentsByPostIdAsync_ReturnsNonDeletedCommentsOnly()
    {
        var testUser = new User
        {
            UserId = 1,
            Nickname = "TestUserNick",
            Email = "test@example.com",
            ProfileImage = "test_profile.jpg"
        };
        await _context.Users.AddAsync(testUser);
        await _context.SaveChangesAsync(); 

        var comment1 = MockExistingComment(postId: 1, userId: testUser.UserId);
        var comment2 = MockExistingComment(postId: 1, userId: testUser.UserId);
        comment2.IsDeleted = true; 
        var comment3 = MockExistingComment(postId: 2, userId: testUser.UserId);

        await _context.Comments.AddRangeAsync(comment1, comment2, comment3);
        await _context.SaveChangesAsync();

        var results = await _service.GetCommentsByPostIdAsync(1, testUser.UserId);

        Assert.Single(results); 
        Assert.Equal(comment1.Text, results[0].Text);
        Assert.Equal(comment1.CommentId, results[0].CommentId);
        Assert.Equal(testUser.Nickname, results[0].Nickname);
        Assert.False(results[0].IsDeleted); 
        Assert.False(results[0].IsLikedByCurrentUser);
    }

    [Fact]
    public async Task ToggleLikeCommentAsync_AddsLike_WhenNotLiked()
    {
        var comment = MockExistingComment();
        var user = new User { UserId = 1, Email = "test@example.com" };
        await _context.Comments.AddAsync(comment);
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var result = await _service.ToggleLikeCommentAsync(comment.CommentId, user.UserId);

        Assert.Equal(1, result.LikesCount);
        Assert.Equal(comment.CommentId, result.CommentId);
        Assert.Equal(user.UserId, result.UserId);
    }

    [Fact]
    public async Task ToggleLikeCommentAsync_RemovesLike_WhenAlreadyLiked()
    {
        var comment = MockExistingComment();
        var user = new User { UserId = 1, Email = "test@example.com" };
        await _context.Comments.AddAsync(comment);
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var commentLikes = _context.Set<Dictionary<string, object>>("CommentLike");
        commentLikes.Add(new Dictionary<string, object>
        {
            ["UserId"] = user.UserId,
            ["CommentId"] = comment.CommentId
        });
        comment.LikesCount = 1;
        await _context.SaveChangesAsync();

        var result = await _service.ToggleLikeCommentAsync(comment.CommentId, user.UserId);

        Assert.Equal(0, result.LikesCount);
    }

    [Fact]
    public async Task ToggleLikeCommentAsync_ThrowsKeyNotFound_WhenCommentMissing()
    {
        var user = new User { UserId = 1, Email = "test@example.com" };
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.ToggleLikeCommentAsync(999, user.UserId));
    }

    [Fact]
    public async Task ToggleLikeCommentAsync_ThrowsKeyNotFound_WhenUserMissing()
    {
        var comment = MockExistingComment();
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.ToggleLikeCommentAsync(comment.CommentId, 999));
    }
}
