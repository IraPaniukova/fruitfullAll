using System.ComponentModel.DataAnnotations;

namespace fruitfullServer.DTO.Users;

public class UserInputDto
{
    [Required]
[RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email format.")]
    public string Email { get; set; } = null!;
    [Required]
    public string Password { get; set; }= null!;  //the field is not in my DB

    [Required]
    public string Country { get; set; } = null!;
    public string? Theme { get; set; } 

    public string? Nickname { get; set; }

    public string? ProfileImage { get; set; }
    public string? AuthProvider { get; set; }

    public string? GoogleId { get; set; }

}
