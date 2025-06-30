using fruitfullServer.DTO;
using fruitfullServer.Models;

namespace fruitfullServer.Utils;
public static class UserUtil
{
    public static UserOutputDto ToUserOutputDto(this User user) => new UserOutputDto
    {
        UserId = user.UserId,
        Email = user.Email,
        Country = user.Country,
        Theme = user.Theme,
        Nickname = user.Nickname,
        ProfileImage = user.ProfileImage,
        CreatedAt = user.CreatedAt
    };
}