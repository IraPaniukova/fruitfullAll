using fruitfullServer.DTO.Comments;
using fruitfullServer.Models;
using fruitfullServer.Utils;
using Microsoft.EntityFrameworkCore;

namespace fruitfullServer.Services;

public class CommentService
{
    private readonly FruitfullDbContext _context;
    private readonly ILogger<CommentService> _logger;

    public CommentService
    (FruitfullDbContext context, ILogger<CommentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<CommentOutputDto> CreateCommentAsync(CommentInputDto dto)
    {      
        var comment = new Comment
        {
            PostId = dto.PostId,
            UserId = dto.UserId,
            Text = dto.Text,
        };
        try
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to save comment to DB.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error.");
            throw;
        }
        return comment.ToCommentOutputDto();
    }
    public async Task<CommentOutputDto?> GetCommentByIdAsync(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) return null;

        return comment.ToCommentOutputDto();
    }

    public async Task<CommentOutputDto> UpdateCommentAsync(int id, CommentUpdateDto dto)
    {
        var comment = await _context.Comments.FindAsync(id) ?? throw new KeyNotFoundException($"Comment with ID {id} not found.");

        if ( dto.Text != comment.Text)  comment.Text = dto.Text;     
        comment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return comment.ToCommentOutputDto();
    }

    public async Task DeleteCommentAsync(int id)
    {
        var comment = await _context.Comments.FindAsync(id) ?? throw new KeyNotFoundException($"Comment with ID {id} not found.");

        comment.IsDeleted = true;
        await _context.SaveChangesAsync();
    }

   //Get all comments for a PostID
    public async Task<List<CommentOutputDto>> GetCommentsByPostIdAsync(int postId)
        {   
    return await _context.Comments
        .Where(c => !c.IsDeleted && c.PostId == postId)
        .Select(c => new CommentOutputDto
        {
            CommentId = c.CommentId,
            UserId = c.UserId,
            PostId = c.PostId,
            Text = c.Text,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            IsDeleted = c.IsDeleted,
            LikesCount = c.LikesCount,
        })
        .ToListAsync();
    }
}