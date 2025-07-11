using fruitfullServer.DTO.JoinEntities;
using fruitfullServer.DTO.Posts;
using fruitfullServer.Models;
using fruitfullServer.Utils;
using Microsoft.EntityFrameworkCore;

namespace fruitfullServer.Services;

public class PostService
{
    private readonly FruitfullDbContext _context;
    private readonly ILogger<PostService> _logger;
    private readonly TagService _tagService;

    public PostService
    (FruitfullDbContext context, ILogger<PostService> logger, TagService tagService)
    {
        _context = context;
        _logger = logger;
        _tagService = tagService;
    }

    // Post creation uses TagService to add tags; tag updates are handled separately in their own controller.
    public async Task<PostOutputDto> CreatePostAsync(PostInputDto dto, int currentUserId)
    {    
        int year;
        int stress;
        if (dto.Year == DateTime.UtcNow.Year || dto.Year == DateTime.UtcNow.Year - 1)
            year = dto.Year;
        else
            throw new ArgumentException("Year must be current year or previous year.");
        if (dto.StressLevel >= 0 && dto.StressLevel <= 5)
            stress = dto.StressLevel;
        else
            throw new ArgumentException("Year must be current year or previous year.");
        var post = new Post
        {
            Content = dto.Content,
            Opinion = dto.Opinion,
            Company = dto.Company,
            Industry = dto.Industry,
            Year = year,
            Country = dto.Country,
            StressLevel = stress,
            QuestionType = dto.QuestionType,
            InterviewFormat = dto.InterviewFormat,
            UserId = currentUserId,
        };

        try
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            await _tagService.AssignTagsToPostAsync(post.PostId, dto.Tags);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to save post to DB.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error.");
            throw;
        }
        return post.ToPostOutputDto();
    }
    public async Task<PostOutputDto?> GetPostByIdAsync(int id)
    {
    try
    {
        var post = await _context.Posts
            .Include(p => p.Tags)
            .FirstOrDefaultAsync(p => p.PostId == id);
        if (post == null) return null;
        return post.ToPostOutputDto();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting post by ID {PostId}", id);
        throw;
    }
    }

    public async Task<PostOutputDto> UpdatePostAsync(int postId, PostUpdateDto dto, int currentUserId)
    {
        
        var post = await _context.Posts.Include(p => p.Tags)
                .FirstOrDefaultAsync(p => p.PostId == postId)
                ?? throw new KeyNotFoundException();

         if (post.UserId != currentUserId)
            throw new UnauthorizedAccessException("You do not have permission.");        

        if (!string.IsNullOrWhiteSpace(dto.Content) && dto.Content != post.Content)
            post.Content = dto.Content;

        if (!string.IsNullOrWhiteSpace(dto.Opinion) && dto.Opinion != post.Opinion)
            post.Opinion = dto.Opinion;

        if (!string.IsNullOrWhiteSpace(dto.Company) && dto.Company != post.Company)
            post.Company = dto.Company;

        if (!string.IsNullOrWhiteSpace(dto.Industry) && dto.Industry != post.Industry)
            post.Industry = dto.Industry;

        if ((dto.Year == DateTime.UtcNow.Year || dto.Year == DateTime.UtcNow.Year - 1) && dto.Year != post.Year)
            post.Year = (int)dto.Year;

        if (!string.IsNullOrWhiteSpace(dto.Country) && dto.Country != post.Country)
            post.Country = dto.Country;

        if (dto.StressLevel >= 0 && dto.StressLevel <= 5 && dto.StressLevel != post.StressLevel)
            post.StressLevel = (int)dto.StressLevel;

        if (!string.IsNullOrWhiteSpace(dto.QuestionType) && dto.QuestionType != post.QuestionType)
            post.QuestionType = dto.QuestionType;

        if (!string.IsNullOrWhiteSpace(dto.InterviewFormat) && dto.InterviewFormat != post.InterviewFormat)
            post.InterviewFormat = dto.InterviewFormat;
        post.UpdatedAt = DateTime.UtcNow;
       
        if (dto.Tags == null || dto.Tags.Count == 0)
            throw new ArgumentException("At least one tag is required.");
        var existingTags = post.Tags.Select(t => t.Name).ToList();
        var incomingTags = dto.Tags;

        bool changed = !existingTags.OrderBy(x => x).SequenceEqual(incomingTags.OrderBy(x => x));

        if (changed)
        {
            await _tagService.DeleteAllTagsFromPostAsync(postId);
            await _tagService.AssignTagsToPostAsync(postId, incomingTags);
        }
      
        try
            {
                await _context.SaveChangesAsync();
                return await GetPostByIdAsync(postId) ?? throw new Exception("Post not found after update");
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Failed to update post in DB.");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating post ID {PostId}", postId);
                throw;
            }  
    }

    public async Task DeletePostAsync(int postId, int currentUserId)
    {
        
    var post = await _context.Posts.FindAsync(postId) ?? throw new KeyNotFoundException();
    post.IsDeleted = true;
     if (post.UserId != currentUserId)
            throw new UnauthorizedAccessException("You do not have permission.");        


    try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to delete post in DB.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error deleting post ID {PostId}", postId);
            throw;
        }
    }

    public async Task<List<PostSummaryDto>> GetRecentPostsAsync(int page, int pageSize)
    {
        try
        {
            return await _context.Posts
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostSummaryDto
                {
                    PostId = p.PostId,
                    UserId=p.UserId,
                    CreatedAt = p.CreatedAt,
                    Content = p.Content,
                    Industry = p.Industry,
                    Country = p.Country,
                    StressLevel = p.StressLevel,                    
                    Tags = p.Tags.Select(t => t.Name).ToList()                 
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching recent posts");
            throw;
        }
    }

    public async Task<List<PostSummaryDto>> GetPostsByTagAsync(string tagName)
    {
        try
        {
            return await _context.Posts
                .Where(p => !p.IsDeleted &&
                   p.Tags.Any(t => t.Name.Equals(tagName.Trim().ToLower())))
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PostSummaryDto
                {
                    PostId = p.PostId,
                    UserId=p.UserId,
                    CreatedAt = p.CreatedAt,
                    Content = p.Content,
                    Industry = p.Industry,
                    Country = p.Country,
                    StressLevel = p.StressLevel
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching posts by tag {TagName}", tagName);
            throw;
        }
    }
    public async Task<List<PostSummaryDto>> GetPostsByUserIdAsync(int userId, int page, int pageSize)
    {
         try
        { 
            return await _context.Posts
                .Where(p => !p.IsDeleted && p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostSummaryDto
                {
                    PostId = p.PostId,
                    UserId=p.UserId,
                    CreatedAt = p.CreatedAt,
                    Content = p.Content,
                    Industry = p.Industry,
                    Country = p.Country,
                    StressLevel = p.StressLevel,
                    Tags = p.Tags.Select(t => t.Name).ToList()
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching posts by user ID {UserId}", userId);
            throw;
        }
    }
    public async Task<PostLikeDto> ToggleLikePostAsync(int postId, int userId)
    {
        var post = await _context.Posts.FindAsync(postId)
            ?? throw new KeyNotFoundException($"Post with ID {postId} not found.");
        var user = await _context.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException($"User with ID {userId} not found.");
            
        var postLikes = _context.Set<Dictionary<string, object>>("PostLike");

        try
        {
            var likeEntry = await postLikes
                .FirstOrDefaultAsync(cl => (int)cl["UserId"] == userId && (int)cl["PostId"] == postId);

            if (likeEntry == null)
            {
                post.LikesCount += 1;
                postLikes.Add(new Dictionary<string, object>
                {
                    ["UserId"] = userId,
                    ["PostId"] = postId
                });
            }
            else
            {
                post.LikesCount -= 1;
                postLikes.Remove(likeEntry);
            }

            await _context.SaveChangesAsync();

            // to clarify: post.UserId - user who wrote the post and userId - user who liked the post
            return new PostLikeDto
            {
                UserId = userId,
                PostId = post.PostId,
                LikesCount = post.LikesCount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling like for post {PostId} by user {UserId}", postId, userId);
            throw;
        }
    }
}