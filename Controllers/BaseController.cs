using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace fruitfullServer.Controllers;

public class BaseController : ControllerBase
{
    protected int GetLoggedInUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (userIdClaim == null) throw new UnauthorizedAccessException("User ID not found in token.");
        return int.Parse(userIdClaim.Value);
    }
}
