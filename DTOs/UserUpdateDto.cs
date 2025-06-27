using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace fruitfullServer.Models;

public partial class UserUpdateDto
{
    public int UserId { get; set; }

    [EmailAddress]
    public string? Email { get; set; }
    public string? Password { get; set; } //the field is not in my DB

    public string? Country { get; set; } 

    public string? Theme { get; set; }

    public string? Nickname { get; set; }

    public string? ProfileImage { get; set; }
}
