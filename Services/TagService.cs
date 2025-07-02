using fruitfullServer.DTO.JoinEntities;
using fruitfullServer.DTO.Tags;
using fruitfullServer.Models;
using fruitfullServer.Utils;
using Microsoft.EntityFrameworkCore;

namespace fruitfullServer.Services;

public class TagService
{
    private readonly FruitfullDbContext _context;
    private readonly ILogger<TagService> _logger;

    public TagService
    (FruitfullDbContext context, ILogger<TagService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<TagOutputDto> CreateTagAsync(TagInputDto dto)
    {
        var existingTag = _context.Tags.FirstOrDefault(t => t.Name == dto.Name);
        if (existingTag != null) 
            return new TagOutputDto 
            { 
                TagId = existingTag.TagId, 
                Name = existingTag.Name 
            };
        var tag = new Tag
        {
            Name = dto.Name
        };
        
        try
        {
            _context.Tags.Add(tag);
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
            TagId = tag.TagId,
            Name = tag.Name
        };
    }
    public async Task<List<TagOutputDto>> CreateTagListAsync(List<TagInputDto> dto)
    {
        var newTags = new List<TagOutputDto>();
        foreach (var o in dto)
        {
            var aNewTag = await CreateTagAsync(o);
             newTags.Add(aNewTag);
        }
        return newTags;
    }
}