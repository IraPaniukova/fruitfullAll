using fruitfullServer.DTO.Comments;
using fruitfullServer.DTO.JoinEntities;
using fruitfullServer.Models;
using fruitfullServer.Utils;
using Microsoft.EntityFrameworkCore;

namespace fruitfullServer.Services;

public class CommentService
{
    private readonly FruitfullDbContext _context;
    private readonly ILogger<CommentService> _logger;

    public CommentService(FruitfullDbContext context, ILogger<CommentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<CommentOutputDto> CreateCommentAsync(CommentInputDto dto, int currentUserId)
    {
        var comment = new Comment
        {
            PostId = dto.PostId,
            UserId = currentUserId,
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
        try
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CommentId == id);

            if (comment == null) return null;
            return comment.ToCommentOutputDto();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting comment by ID {CommentId}", id);
            throw;
        }
    }

    public async Task<CommentOutputDto> UpdateCommentAsync(int id, CommentUpdateDto dto, int currentUserId)
    {
        var comment = await _context.Comments.FindAsync(id)
            ?? throw new KeyNotFoundException($"Comment with ID {id} not found.");
        if (comment.UserId != currentUserId)
            throw new UnauthorizedAccessException("You do not have permission.");  
        if (dto.Text != comment.Text) comment.Text = dto.Text;
        comment.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
            return comment.ToCommentOutputDto();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to update comment in DB.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating comment ID {CommentId}", id);
            throw;
        }
    }

    public async Task DeleteCommentAsync(int id, int currentUserId)
    {
        var comment = await _context.Comments.FindAsync(id)
            ?? throw new KeyNotFoundException($"Comment with ID {id} not found.");
        if (comment.UserId != currentUserId)
            throw new UnauthorizedAccessException("You do not have permission.");
        comment.IsDeleted = true;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to delete comment from DB.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting comment ID {CommentId}", id);
            throw;
        }
    }

    public async Task<List<CommentOutputDto>> GetCommentsByPostIdAsync(int postId)
    {
        try
        {
            return await _context.Comments
                .Where(c => !c.IsDeleted && c.PostId == postId)
                .Include(c => c.User)
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
                    Nickname = c.User != null ? c.User.Nickname : null,
                    ProfileImage = c.User != null ? c.User.ProfileImage : null
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting comments for post {PostId}", postId);
            throw;
        }
    }

    public async Task<CommentLikeDto> ToggleLikeCommentAsync(int commentId, int userId)
    {
        var comment = await _context.Comments.FindAsync(commentId)
            ?? throw new KeyNotFoundException($"Comment with ID {commentId} not found.");
        var user = await _context.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException($"User with ID {userId} not found.");
        var commentLikes = _context.Set<Dictionary<string, object>>("CommentLike");

        try
        {
            var likeEntry = await commentLikes
                .FirstOrDefaultAsync(cl => (int)cl["UserId"] == userId && (int)cl["CommentId"] == commentId);

            if (likeEntry == null)
            {
                comment.LikesCount += 1;
                commentLikes.Add(new Dictionary<string, object>
                {
                    ["UserId"] = userId,
                    ["CommentId"] = commentId
                });
            }
            else
            {
                comment.LikesCount -= 1;
                commentLikes.Remove(likeEntry);
            }

            await _context.SaveChangesAsync();

            // to clarify: comment.UserId - user who wrote the comment and userId - user who liked the comment
            return new CommentLikeDto
            {
                UserId = userId,
                CommentId = comment.CommentId,
                LikesCount = comment.LikesCount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling like for comment {CommentId} by user {UserId}", commentId, userId);
            throw;
        }
    }
}
