using System;
using System.Collections.Generic;

namespace fruitfullServer.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public int PostId { get; set; }

    public int UserId { get; set; }

    public string Text { get; set; } = null!;

    public DateTime? CreatedAt { get; set; } //it set not to nullable in the DB and applies GETDATE()

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public int? LikesCount { get; set; }

    public virtual Post? Post { get; set; }

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual User? User { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
