using System;
using System.Collections.Generic;

namespace fruitfullServer.DTO;

public partial class UserOutputDto
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string Theme { get; set; } = null!;

    public string? Nickname { get; set; }

    public string? ProfileImage { get; set; }
    public DateTime? CreatedAt { get; set; }

}
