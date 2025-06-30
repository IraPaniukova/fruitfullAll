namespace fruitfullServer.DTO;

public class CommentOutputDto
{
     public int? CommentId { get; set; }
    public int PostId { get; set; }
    public int UserId { get; set; }
    public string Text { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public int EditCount { get; set; }
    public int LikesCount { get; set; }
}