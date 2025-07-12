namespace fruitfullServer.DTO.Comments;

public class CommentOutputDto
{
    public int? CommentId { get; set; }
    public int? PostId { get; set; }
    public int? UserId { get; set; }
    public string? Text { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public int? LikesCount { get; set; }
    public string? Nickname { get; set; }
    public string? ProfileImage { get; set; }
}