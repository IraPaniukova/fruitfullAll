using System;
using System.Collections.Generic;

namespace fruitfullServer.Models;

public partial class Post
{
    public int PostId { get; set; }

    public string Content { get; set; } = null!;

    public string? Opinion { get; set; }

    public string Company { get; set; } = null!;

    public string Industry { get; set; } = null!;

    public int Year { get; set; }

    public string Country { get; set; } = null!;

    public int StressLevel { get; set; }

    public string QuestionType { get; set; } = null!;

    public string InterviewFormat { get; set; } = null!;

    public int UserId { get; set; }

    public DateTime? CreatedAt { get; set; }  //it set not to nullable in the DB and applies GETDATE()

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public int LikesCount { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual User User { get; set; } = null!;

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
