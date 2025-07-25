namespace fruitfullServer.DTO.JoinEntities;

public class CommentLikeDto
{
    public int UserId { get; set; }
    public int CommentId { get; set; }
    public int? LikesCount { get; set; }
    public bool? IsLikedByCurrentUser { get; set; }
}