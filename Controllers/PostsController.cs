using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Models;
using fruitfullServer.DTO;

[Route("api/[controller]")]
[ApiController]
public class PostsController : ControllerBase
{
    private readonly FruitfullDbContext _context;

    public PostsController(FruitfullDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<PostSummaryDto>>> GetPosts(int page = 1, int size = 10)
    {
        try
        {
            var posts = await _context.Posts
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(p => new PostSummaryDto
                {
                    PostId = p.PostId,
                    Content = p.Content,
                    Industry = p.Industry,
                    StressLevel = p.StressLevel,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(posts);
        }
        catch
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostDto>> GetPost(int id)
    {
        try
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            var dto = new PostDto
            {
                PostId = post.PostId,
                Content = post.Content,
                Opinion = post.Opinion,
                Company = post.Company,
                Industry = post.Industry,
                Year = post.Year,
                Country = post.Country,
                StressLevel = post.StressLevel,
                QuestionType = post.QuestionType,
                InterviewFormat = post.InterviewFormat,
                UserId = post.UserId,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                IsDeleted = post.IsDeleted,
                LikesCount = post.LikesCount
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            // log ex if you have logging
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<PostDto>> CreatePost(PostDto postDto)
    {
        try
        {
            var post = new Post
            {
                Content = postDto.Content,
                Opinion = postDto.Opinion,
                Company = postDto.Company,
                Industry = postDto.Industry,
                Year = postDto.Year,
                Country = postDto.Country,
                StressLevel = postDto.StressLevel,
                QuestionType = postDto.QuestionType,
                InterviewFormat = postDto.InterviewFormat,
                UserId = postDto.UserId,
                CreatedAt = DateTime.Now,
                IsDeleted = false,
                LikesCount = 0
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            postDto.PostId = post.PostId;
            postDto.CreatedAt = post.CreatedAt;

            return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, postDto);
        }
        catch (Exception ex)
        {
            // log ex
            return StatusCode(500, "Internal server error");
        }
    }

    // Add Update, Delete similarly with try-catch

}
