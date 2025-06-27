using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace fruitfullServer.DTO;

public class UserInputDto
{
    [Required]
    [EmailAddress]
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
