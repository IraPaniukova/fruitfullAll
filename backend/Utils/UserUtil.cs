using fruitfullServer.DTO.Users;
using fruitfullServer.Models;

namespace fruitfullServer.Utils;
public static class UserUtil
{
    public static UserOutputDto ToUserOutputDto(this User user) => new()
    {
        UserId = user.UserId,
        Country = user.Country,
        Theme = user.Theme,
        Nickname = user.Nickname,
        ProfileImage = user.ProfileImage,
        CreatedAt = user.CreatedAt,
        Email =user.Email
    };
}