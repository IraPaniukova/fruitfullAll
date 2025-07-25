using System.ComponentModel.DataAnnotations;

namespace fruitfullServer.DTO.Users;

public partial class UserUpdateLoginDto
{
    [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email format.")]
    public string? Email { get; set; }
    public string? Password { get; set; } //the field is not in my DB
    public string? NewPassword { get; set; } //the field is not in my DB
}
