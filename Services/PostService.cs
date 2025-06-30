using fruitfullServer.DTO.Posts;
using fruitfullServer.Models;
using fruitfullServer.Utils;
using Microsoft.EntityFrameworkCore;
namespace fruitfullServer.Services;

public class PostService
{
    private readonly FruitfullDbContext _context;
    private readonly ILogger<PostService> _logger;

    public PostService
    (FruitfullDbContext context, ILogger<PostService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PostOutputDto> CreatePostAsync(PostInputDto dto)
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
            UserId = dto.UserId,
        };

        try
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
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
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return null;

        return post.ToPostOutputDto();
    }

    public async Task<PostOutputDto> UpdatePostAsync(int id, PostUpdateDto dto)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) throw new KeyNotFoundException();

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

        await _context.SaveChangesAsync();

        return await GetPostByIdAsync(id) ?? throw new Exception("Post not found after update");
    }

    public async Task DeletePostAsync(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) throw new KeyNotFoundException();

        post.IsDeleted = true;
        await _context.SaveChangesAsync();
    }

    public async Task<List<PostSummaryDto>> GetRecentPostsAsync(int page, int pageSize)
    {
        return await _context.Posts
            .Where(p => !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PostSummaryDto
            {
                PostId = p.PostId,
                CreatedAt = p.CreatedAt,
                Content = p.Content,
                Industry = p.Industry,
                StressLevel = (int)p.StressLevel
            })
            .ToListAsync();
    }

    public async Task<List<PostSummaryDto>> GetPostsByTagAsync(string tagName)
    {
        return await _context.Posts
            .Where(p => !p.IsDeleted && p.Tags.Any(t => t.Name == tagName))
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostSummaryDto
            {
                PostId = p.PostId,
                CreatedAt = p.CreatedAt,
                Content = p.Content,
                Industry = p.Industry,
                StressLevel = p.StressLevel
            })
            .ToListAsync();
    }
    public async Task<List<PostSummaryDto>> GetPostsByUserIdAsync(int userId, int page, int pageSize)
        {   
    return await _context.Posts
        .Where(p => !p.IsDeleted && p.UserId == userId)
        .OrderByDescending(p => p.CreatedAt)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(p => new PostSummaryDto
        {
            PostId = p.PostId,
            CreatedAt = p.CreatedAt,
            Content = p.Content,
            Industry = p.Industry,
            StressLevel = p.StressLevel
        })
        .ToListAsync();
    }
}