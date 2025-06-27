using System;
using System.Collections.Generic;

namespace fruitfullServer.DTO;

public partial class UserInputDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; }= null!;  //the field is not in my DB

    public string Country { get; set; } = null!;

    public string Theme { get; set; } = null!;

    public string? Nickname { get; set; }

    public string? ProfileImage { get; set; }
    public string? AuthProvider { get; set; }

    public string? GoogleId { get; set; }

}
