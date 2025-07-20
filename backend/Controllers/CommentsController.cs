using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fruitfullServer.Models;
using fruitfullServer.Services;
using fruitfullServer.DTO.Comments;
using Microsoft.AspNetCore.Authorization;
using fruitfullServer.DTO.JoinEntities;
using Microsoft.AspNetCore.SignalR;
using fruitfullServer.Hubs;

namespace fruitfullServer.Controllers;

[Authorize(Policy = "LoginPolicy")]
[Route("api/[controller]")]
[ApiController]
public class CommentsController : BaseController
{
    private readonly CommentService _commentService;
    private readonly IHubContext<CommentHub> _hubContext;
    public CommentsController(CommentService commentService, IHubContext<CommentHub> hubContext)
    {
        _commentService = commentService;
        _hubContext = hubContext;
    }

    // POST: api/Comments
    [HttpPost]
    public async Task<ActionResult<CommentOutputDto>> CreateComment(CommentInputDto comment)
    {
        try
        {
            var currentUserId = GetLoggedInUserId();
            var _comment = await _commentService.CreateCommentAsync(comment,currentUserId);
            await _hubContext.Clients.All.SendAsync("commentadded", _comment);

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
            var currentUserId = GetLoggedInUserId();
            var updated = await _commentService.UpdateCommentAsync(id, dto,currentUserId);
            await _hubContext.Clients.All.SendAsync("commentedited", updated);

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
             var currentUserId = GetLoggedInUserId();
            var comments = await _commentService.GetCommentsByPostIdAsync(postId,currentUserId);
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
            var currentUserId = GetLoggedInUserId();
            await _commentService.DeleteCommentAsync(id,currentUserId);
            await _hubContext.Clients.All.SendAsync("commentdeleted", id);

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
    // PATCH: api/Comments/{commentId}/{userId}
    [HttpPatch("{commentId}")]
    public async Task<ActionResult<CommentLikeDto>> UpdateLikes(int commentId)
    {
        try
        {
            var currentUserId = GetLoggedInUserId();
            var updated = await _commentService.ToggleLikeCommentAsync(commentId, currentUserId);
            await _hubContext.Clients.All.SendAsync("commentliked", updated);

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
