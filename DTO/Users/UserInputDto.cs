using System.ComponentModel.DataAnnotations;

namespace fruitfullServer.DTO.Users;

public class UserInputDto
{
    [Required]
    [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email format.")]
    public string Email { get; set; } = null!;
    [Required]
    public string Password { get; set; }= null!;  //the field is not in my DB
    public string? IdToken { get; set; } //the field is not in my DB - for google auth
    public string? AuthProvider { get; set; }

    public string? GoogleId { get; set; }

}
