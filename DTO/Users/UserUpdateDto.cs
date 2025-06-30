using System.ComponentModel.DataAnnotations;

namespace fruitfullServer.DTO.Users;

public partial class UserUpdateDto
{
[RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email format.")]
    public string? Email { get; set; }
    public string? Password { get; set; } //the field is not in my DB

    public string? Country { get; set; } 

    public string? Theme { get; set; }

    public string? Nickname { get; set; }

    public string? ProfileImage { get; set; }
}
