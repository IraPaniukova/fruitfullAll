using fruitfullServer.DTO.Tags;
using fruitfullServer.Models;
using Microsoft.EntityFrameworkCore;

namespace fruitfullServer.Services;

public class TagService
{
    private readonly FruitfullDbContext _context;
    private readonly ILogger<TagService> _logger;

    public TagService(FruitfullDbContext context, ILogger<TagService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<TagOutputDto> CreateOrFindTagAsync(string tag)
    {
        if (string.IsNullOrWhiteSpace(tag))
            throw new ArgumentException("Tag cannot be empty or whitespace.");

        var normalizedTag = tag.Trim().ToLowerInvariant();

        var existingTag = await _context.Tags
            .FirstOrDefaultAsync(t => t.Name.ToLowerInvariant() == normalizedTag);

        if (existingTag != null)
            return new TagOutputDto
            {
                TagId = existingTag.TagId,
                Name = existingTag.Name
            };

        var newTag = new Tag
        {
            Name = normalizedTag
        };

        try
        {
            _context.Tags.Add(newTag);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to save tag to DB.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error.");
            throw;
        }

        return new TagOutputDto
        {
            TagId = newTag.TagId,
            Name = newTag.Name
        };
    }

    public async Task<List<TagOutputDto>> CreateTagsAsync(List<string> tags)
    {
        if (tags == null || tags.Count == 0)
            throw new ArgumentException("At least one tag is required.");

        try
        {
            var newTags = new List<TagOutputDto>();
            foreach (var o in tags)
            {
                var aNewTag = await CreateOrFindTagAsync(o);
                newTags.Add(aNewTag);
            }
            return newTags;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating tag list.");
            throw;
        }
    }

    public async Task<List<TagOutputDto>> GetTagsAsync() // potentially to support autocomplete
    {
        try
        {
            var tags = await _context.Tags.ToListAsync();
            var result = tags.Select(t => new TagOutputDto
            {
                TagId = t.TagId,
                Name = t.Name
            }).ToList();
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching tag list.");
            throw;
        }
    }

    public async Task ConnectTagToPostAsync(int postId, string tag)
    {
        if (string.IsNullOrWhiteSpace(tag))
            throw new ArgumentException("Tag cannot be empty or whitespace.");

        try
        {
            var newTag = await CreateOrFindTagAsync(tag)
                ?? throw new ArgumentException("Failed to create or retrieve tag.");

            var post = await _context.Posts.Include(u => u.Tags)
                .FirstOrDefaultAsync(u => u.PostId == postId)
                ?? throw new ArgumentException($"There is no post '{postId}' in DB");

            if (post.Tags.Any(r => r.TagId == newTag.TagId))
                throw new ArgumentException("Tag already assigned to the post");

            var tagEntity = await _context.Tags.FindAsync(newTag.TagId)
                ?? throw new ArgumentException($"Tag with ID {newTag.TagId} not found in DB.");

            post.Tags.Add(tagEntity);

            // Note: this method does NOT save changes to the DB. Caller must save.
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning tag {Tag} to post {PostId}", tag, postId);
            throw;
        }
    }

    public virtual async Task AssignTagsToPostAsync(int postId, List<string> tags)
    {
        if (tags == null || tags.Count == 0)
            throw new ArgumentException("There were no tags.");

        try
        {
            foreach (var t in tags)
            {
                if (string.IsNullOrWhiteSpace(t))
                    throw new ArgumentException("Tag name cannot be null or empty.");
                await ConnectTagToPostAsync(postId, t);
            }
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while assigning tag list to post.");
            throw;
        }
    }

    public virtual async Task DeleteAllTagsFromPostAsync(int postId)
    {
        try
        {
            var post = await _context.Posts.Include(p => p.Tags)
                .FirstOrDefaultAsync(p => p.PostId == postId)
                ?? throw new ArgumentException($"There is no post '{postId}' in DB");

            post.Tags.Clear(); // removes all tags from the post

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing all tags from post {PostId}", postId);
            throw;
        }
    }
}
