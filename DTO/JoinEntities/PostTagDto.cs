namespace fruitfullServer.DTO.JoinEntities;

public class PostTagDto
{
    public int PostId { get; set; }
    public int TagId { get; set; }
    public string? Name { get; set; } = null!;

}