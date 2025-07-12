using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using fruitfullServer.DTO.Comments;
using fruitfullServer.DTO.JoinEntities;

namespace fruitfullServer.Hubs;

[Authorize(Policy = "LoginPolicy")]
public class CommentHub : Hub
{
    public async Task SendComment(CommentOutputDto comment)
    {
        await Clients.All.SendAsync("commentadded", comment);
    }
    public async Task EditComment(CommentOutputDto comment)
    {
        await Clients.All.SendAsync("commentedited", comment);
    }

    public async Task DeleteComment(int commentId)
    {
        await Clients.All.SendAsync("commentdeleted", commentId);
    }

    public async Task LikeComment(CommentLikeDto like)
    {
        await Clients.All.SendAsync("commentliked", like);
    }
}
