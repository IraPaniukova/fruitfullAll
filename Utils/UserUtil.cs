using fruitfullServer.DTO;
using fruitfullServer.Models;

public static class UserUtil
{
    public static UserOutputDto ToOutputDto(this User user) => new UserOutputDto
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