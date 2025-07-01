using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Models;
using fruitfullServer.Services;
using fruitfullServer.DTO.Comments;
using Microsoft.AspNetCore.Authorization;

namespace fruitfullServer.Controllers;

// [Authorize(Policy = "LoginPolicy")]
[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly FruitfullDbContext _context;
    private readonly CommentService _commentService;
    public CommentsController(FruitfullDbContext context, CommentService commentService)
    {
        _context = context;
        _commentService = commentService;
    }
    
    // POST: api/Comments
    [HttpPost]
    public async Task<ActionResult<CommentOutputDto>> CreateComment(CommentInputDto comment)
    {
        try
        {
            var _comment = await _commentService.CreateCommentAsync(comment);
            return CreatedAtAction(nameof(GetComment), new { id = _comment.CommentId }, _comment);
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = "Unable to save comment: " + ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error: " + ex.Message });
        }
    }

    // PUT: api/Comments/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<CommentOutputDto>> UpdateComment(int id, CommentUpdateDto dto)
    {
        try
        {
            var updated = await _commentService.UpdateCommentAsync(id, dto);
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

    // GET: api/Comments/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<CommentOutputDto>> GetComment(int id)
    {
        var comment = await _commentService.GetCommentByIdAsync(id);
        if (comment == null) return NotFound();
        return comment;
    }

    // GET: api/Comments/Post/{postId}
    [HttpGet("Post/{postId}")]
    public async Task<ActionResult<List<CommentOutputDto>>> GetCommentsByPostId(int postId)
    {
        try
        {
            var comments = await _commentService.GetCommentsByPostIdAsync(postId);
            return Ok(comments);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error: " + ex.Message });
        }
    }
    
     // DELETE: api/Comments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        try
        {
            await _commentService.DeleteCommentAsync(id);
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
}
