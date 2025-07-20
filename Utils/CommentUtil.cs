using fruitfullServer.DTO.Comments;
using fruitfullServer.Models;

namespace fruitfullServer.Utils;

public static class CommentUtil
{
    public static CommentOutputDto ToCommentOutputDto(this Comment comment,int currentUserId) => new()
    {
        CommentId = comment.CommentId,
        UserId = comment.UserId,
        PostId = comment.PostId,
        Text = comment.Text,
        CreatedAt = comment.CreatedAt,
        UpdatedAt = comment.UpdatedAt,
        IsDeleted = comment.IsDeleted,
        LikesCount = comment.LikesCount,
        Nickname = comment.User?.Nickname,
        ProfileImage = comment.User?.ProfileImage,  
        IsLikedByCurrentUser = comment.Users.Any(u => u.UserId == currentUserId)

    };
}
