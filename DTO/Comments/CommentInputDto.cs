namespace fruitfullServer.DTO.Comments;

public class CommentInputDto
{
    public int PostId { get; set; }
    public string Text { get; set; } = null!;
}