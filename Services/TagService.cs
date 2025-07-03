using fruitfullServer.DTO.JoinEntities;
using fruitfullServer.DTO.Tags;
using fruitfullServer.Models;
using fruitfullServer.Utils;
using Microsoft.AspNetCore.Mvc;
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
        var existingTag = _context.Tags.FirstOrDefault(t => t.Name == tag);
        if (existingTag != null)
            return new TagOutputDto
            {
                TagId = existingTag.TagId,
                Name = existingTag.Name
            };
        var newTag = new Tag
        {
            Name = tag
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
    public async Task<List<TagOutputDto>> CreateTagsAsync (List<string> tags)
    {
        if (tags == null || tags.Count == 0) throw new ArgumentException("At least one tag is required.");
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
    public async Task<List<TagOutputDto>> GetTagsAsync() //potentially to support autocomplete 
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
    public async Task<List<TagOutputDto>> GetTagsByPostIdAsync(int postId)
    {
        try
        {
            var tags = await _context.Tags.Where(t => t.Posts.Any(p => p.PostId == postId)).ToListAsync();
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

    public async Task ConnectTagToPostAsync (int postId, string tag)
    // Adds the tag to the post's navigation property without saving changes to the database.
    {
        try
        {
            var newTag = await CreateOrFindTagAsync(tag) ??
            throw new ArgumentException($"Failed to create or retrieve tag.");
            var post = await _context.Posts.Include(u => u.Tags)
                .FirstOrDefaultAsync(u => u.PostId == postId)
                ?? throw new ArgumentException($"There is no post '{postId}' in DB");

            if (post.Tags.Any(r => r.TagId == newTag.TagId))
                throw new ArgumentException($"Tag already assigned to the post");

            var tagEntity = await _context.Tags.FindAsync(newTag.TagId)
                ?? throw new ArgumentException($"Tag with ID {newTag.TagId} not found in DB.");
            post.Tags.Add(tagEntity);

           //attention! this function doesnt save to DB
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tag {tag.Name} from post {postId}", tag, postId);
            throw;
        }
    }
    public async Task AssignTagsToPostAsync(int postId, List<string> tags)
    {
    if (tags == null || tags.Count == 0) throw new ArgumentException("There were no tags.");
        try
        {
            foreach (var t in tags)
            {
                if (string.IsNullOrWhiteSpace(t))
                    throw new ArgumentException("Tag name cannot be null or empty.");
                await ConnectTagToPostAsync (postId, t);
            }       
             await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating tag list.");
            throw;
        }
    }

    public async Task DeletePostTag(PostTagDto dto)
    //I use soft delet for posts, so this method wil be for editing purposes
    {
        try
        {
            var post = await _context.Posts.Include(u => u.Tags)
            .FirstOrDefaultAsync(u => u.PostId == dto.PostId)
            ?? throw new ArgumentException($"There is no post '{dto.PostId}' in DB");

            var tagToRemove = post.Tags.FirstOrDefault(t => t.TagId == dto.TagId)
             ?? throw new ArgumentException($"There is no tag with ID '{dto.TagId}' linked to post.");

            post.Tags.Remove(tagToRemove);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tag {TagId} from post {PostId}", dto.TagId, dto.PostId);
            throw;
        }
    }
}