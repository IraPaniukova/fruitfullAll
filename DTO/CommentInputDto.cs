namespace fruitfullServer.DTO;

public class CommentInputDto
{
    public int PostId { get; set; }
    public int UserId { get; set; }
    public string Text { get; set; } = null!;
}