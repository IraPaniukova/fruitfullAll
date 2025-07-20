using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using fruitfullServer.DTO.Comments;
using fruitfullServer.DTO.JoinEntities;

namespace fruitfullServer.Hubs;

[Authorize(Policy = "LoginPolicy")]
public class CommentHub : Hub
{
    public Task SendComment(CommentOutputDto comment)
    {
        return Clients.All.SendAsync("commentadded", comment);
    }

    public Task EditComment(CommentOutputDto comment)
    {
        return Clients.All.SendAsync("commentedited", comment);
    }

    public Task DeleteComment(int commentId)
    {
        return Clients.All.SendAsync("commentdeleted", commentId);
    }

    public Task LikeComment(CommentLikeDto like)
    {
        return Clients.All.SendAsync("commentliked", like);
    }
}
