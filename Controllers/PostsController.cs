using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Models;
using fruitfullServer.Services;
using fruitfullServer.DTO.Posts;
using Microsoft.AspNetCore.Authorization;
using fruitfullServer.DTO.JoinEntities;

namespace fruitfullServer.Controllers;

// [Authorize(Policy = "LoginPolicy")]
[Route("api/[controller]")]
[ApiController]
public class PostsController : ControllerBase
{
    private readonly FruitfullDbContext _context;
    private readonly PostService _postService;
    public PostsController(FruitfullDbContext context, PostService postService)
    {
        _context = context;
        _postService = postService;
    }
    // GET: api/Posts/recent?page=1&pageSize=10
    [HttpGet("recent")]
    public async Task<ActionResult<List<PostSummaryDto>>> GetRecentPosts(int page = 1, int pageSize = 10)
    {
        return await _postService.GetRecentPostsAsync(page, pageSize);
    }

    // POST: api/Posts
    [HttpPost]
    public async Task<ActionResult<PostOutputDto>> CreatePost(PostInputDto post)
    {
        try
        {
            var _post = await _postService.CreatePostAsync(post);
            return CreatedAtAction(nameof(GetPost), new { id = _post.PostId }, _post);
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = "Unable to save post: " + ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error: " + ex.Message });
        }
    }

    // PUT: api/Posts/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<PostOutputDto>> UpdatePost(int id, PostUpdateDto dto)
    {
        try
        {
            var updated = await _postService.UpdatePostAsync(id, dto);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Update error: " + ex.Message });
        }
    }

    // GET: api/Posts/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<PostOutputDto>> GetPost(int id)
    {
        var post = await _postService.GetPostByIdAsync(id);
        if (post == null) return NotFound();
        return post;
    }

    // GET: api/Posts/by-tag?tagName=example
    [HttpGet("by-tag")]
    public async Task<ActionResult<List<PostSummaryDto>>> GetPostsByTag([FromQuery] string tagName)
    {
        return await _postService.GetPostsByTagAsync(tagName);
    }
    // GET: api/Posts/User/{userId}?page=1&pageSize=10
    [HttpGet("User/{userId}")]
    public async Task<ActionResult<List<PostSummaryDto>>> GetPostsByUserId(int userId, int page = 1, int pageSize = 10)
    {
        try
        {
            var posts = await _postService.GetPostsByUserIdAsync(userId, page, pageSize);
            return Ok(posts);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error: " + ex.Message });
        }
    }

    // DELETE: api/Posts/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        try
        {
            await _postService.DeletePostAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Delete error: " + ex.Message });
        }
    }
     // PATCH: api/Posts/{postId}/{userId}
    [HttpPatch("{postId}/{userId}")]
    public async Task<ActionResult<PostLikeDto>> UpdateLikes(int postId, int userId)
    {
        try
        {
            var updated = await _postService.ToggleLikePostAsync(postId, userId);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Update error: " + ex.Message });
        }
    }
}
