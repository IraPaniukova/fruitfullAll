using System;
using System.Collections.Generic;

namespace fruitfullServer.Models;

public partial class Post
{
    public int PostId { get; set; }

    public string Content { get; set; } = null!;

    public string? Company { get; set; }

    public string? Industry { get; set; }

    public int? Year { get; set; }

    public string? Country { get; set; }

    public int? StressLevel { get; set; }

    public string? QuestionType { get; set; }

    public string? InterviewFormat { get; set; }

    public int? UserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public int? LikesCount { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual User? User { get; set; }

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
