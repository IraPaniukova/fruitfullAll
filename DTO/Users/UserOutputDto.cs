namespace fruitfullServer.DTO.Users;
public class UserOutputDto
{
    public int UserId { get; set; }

    public string? Country { get; set; }

    public string? Theme { get; set; }

    public string? Nickname { get; set; }

    public string? ProfileImage { get; set; }
    public DateTime? CreatedAt { get; set; }

}
