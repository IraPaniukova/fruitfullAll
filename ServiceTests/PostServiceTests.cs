using fruitfullServer.DTO.Posts;
using fruitfullServer.Models;
using fruitfullServer.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace fruitfullTest.ServiceTests
{
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
                Tags = tags ?? new List<Tag>()
            };
        }

        [Fact]
        public async Task CreatePostAsync_CreatesPostWithTags()
        {
            var dto = new PostInputDto
            {
                Content = "Test content",
                Opinion = "Good",
                Company = "TestCo",
                Industry = "IT",
                Year = DateTime.UtcNow.Year,
                Country = "NZ",
                StressLevel = 2,
                QuestionType = "Tech",
                InterviewFormat = "Online",
                Tags = new List<string> { "tag1", "tag2" }
            };

            _mockTagService.Setup(t => t.AssignTagsToPostAsync(It.IsAny<int>(), dto.Tags))
                .Returns(Task.CompletedTask);

            var result = await _service.CreatePostAsync(dto, 1);

            Assert.NotNull(result);
            Assert.Equal(dto.Content, result.Content);
            Assert.Equal(dto.Company, result.Company);
            _mockTagService.Verify(t => t.AssignTagsToPostAsync(result.PostId, dto.Tags), Times.Once);
        }

        [Fact]
        public async Task CreatePostAsync_Throws_WhenYearInvalid()
        {
            var dto = new PostInputDto
            {
                Content = "Test",
                Company = "Co",
                Industry = "Ind",
                Year = 2000,
                Country = "NZ",
                StressLevel = 3,
                QuestionType = "Tech",
                InterviewFormat = "Online",
                Tags = new List<string> { "t1" }
            };

            await Assert.ThrowsAsync<ArgumentException>(() => _service.CreatePostAsync(dto, 1));
        }

        [Fact]
        public async Task GetPostByIdAsync_ReturnsPost_WhenExists()
        {
            var post = MockExistingPost();
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            var result = await _service.GetPostByIdAsync(post.PostId);

            Assert.NotNull(result);
            Assert.Equal(post.Content, result!.Content);
        }

        [Fact]
        public async Task GetPostByIdAsync_ReturnsNull_WhenNotFound()
        {
            var result = await _service.GetPostByIdAsync(-1);
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdatePostAsync_UpdatesFieldsAndTags()
        {
            var tags = new List<Tag> { new() { Name = "oldTag" } };
            var post = MockExistingPost(tags);
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            var updateDto = new PostUpdateDto
            {
                Content = "new content",
                Tags = ["newTag"]
            };

            _mockTagService.Setup(t => t.DeleteAllTagsFromPostAsync(post.PostId))
                .Returns(Task.CompletedTask);
            _mockTagService.Setup(t => t.AssignTagsToPostAsync(post.PostId, updateDto.Tags!))
                .Returns(Task.CompletedTask);

            var updatedPost = await _service.UpdatePostAsync(post.PostId, updateDto, post.UserId);

            Assert.Equal("new content", updatedPost.Content);
            _mockTagService.Verify(t => t.DeleteAllTagsFromPostAsync(post.PostId), Times.Once);
            _mockTagService.Verify(t => t.AssignTagsToPostAsync(post.PostId, updateDto.Tags!), Times.Once);
        }

        [Fact]
        public async Task UpdatePostAsync_Throws_WhenUserMismatch()
        {
            var post = MockExistingPost();
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            var updateDto = new PostUpdateDto { Content = "update" };

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                _service.UpdatePostAsync(post.PostId, updateDto, post.UserId + 1));
        }

        [Fact]
        public async Task DeletePostAsync_SetsIsDeleted()
        {
            var post = MockExistingPost();
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            await _service.DeletePostAsync(post.PostId, post.UserId);

            var deletedPost = await _context.Posts.FindAsync(post.PostId);
            Assert.True(deletedPost!.IsDeleted);
        }

        [Fact]
        public async Task DeletePostAsync_Throws_WhenUserMismatch()
        {
            var post = MockExistingPost();
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                _service.DeletePostAsync(post.PostId, post.UserId + 1));
        }

        [Fact]
        public async Task GetRecentPostsAsync_ReturnsPagedPosts()
        {
            for (int i = 0; i < 5; i++)
            {
                var post = MockExistingPost();
                post.CreatedAt = DateTime.UtcNow.AddDays(-i);
                _context.Posts.Add(post);
            }
            await _context.SaveChangesAsync();

            var result = await _service.GetRecentPostsAsync(1, 3);

            Assert.Equal(3, result.Count);
            Assert.True(result[0].CreatedAt >= result[1].CreatedAt);
        }

        [Fact]
        public async Task GetPostsByTagAsync_ReturnsPostsWithTag()
        {
            var tag = new Tag { Name = "special" };
            var post = MockExistingPost(new List<Tag> { tag });
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            var result = await _service.GetPostsByTagAsync("special");

            Assert.Single(result);
            Assert.Equal(post.Content, result[0].Content);
        }

        [Fact]
        public async Task GetPostsByUserIdAsync_ReturnsPostsForUser()
        {
            var post = MockExistingPost();
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            var result = await _service.GetPostsByUserIdAsync(post.UserId, 1, 10);

            Assert.Single(result);
            Assert.Equal(post.Content, result[0].Content);
        }

        [Fact]
        public async Task ToggleLikePostAsync_AddsLike_WhenNotLiked()
        {
            var post = MockExistingPost();
            var user = new User { UserId = 2, Email = "test@example.com", PasswordHash = "pw" };
            _context.Posts.Add(post);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = await _service.ToggleLikePostAsync(post.PostId, user.UserId);

            Assert.Equal(user.UserId, result.UserId);
            Assert.Equal(post.PostId, result.PostId);
            Assert.Equal(1, result.LikesCount);
        }

        [Fact]
        public async Task ToggleLikePostAsync_RemovesLike_WhenAlreadyLiked()
        {
            var post = MockExistingPost();
            var user = new User { UserId = 2, Email = "test@example.com", PasswordHash = "pw" };
            _context.Posts.Add(post);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Manually add like entry
            var postLikes = _context.Set<Dictionary<string, object>>("PostLike");
            postLikes.Add(new Dictionary<string, object> { ["UserId"] = user.UserId, ["PostId"] = post.PostId });
            post.LikesCount = 1;
            await _context.SaveChangesAsync();

            var result = await _service.ToggleLikePostAsync(post.PostId, user.UserId);

            Assert.Equal(user.UserId, result.UserId);
            Assert.Equal(post.PostId, result.PostId);
            Assert.Equal(0, result.LikesCount);
        }
    }
}
