using fruitfullServer.DTO.Posts;
using fruitfullServer.Models;

namespace fruitfullServer.Utils;

public static class PostUtil
{
    public static PostOutputDto ToPostOutputDto(this Post post) => new PostOutputDto
    {
        PostId = post.PostId,
        Content = post.Content,
        Opinion = post.Opinion,
        Company = post.Company,
        Industry = post.Industry,
        Year = post.Year,
        Country = post.Country,
        StressLevel = post.StressLevel,
        QuestionType = post.QuestionType,
        InterviewFormat = post.InterviewFormat,
        UserId = post.UserId,
        CreatedAt = post.CreatedAt,
        IsDeleted = post.IsDeleted,
        LikesCount = post.LikesCount
    };
}