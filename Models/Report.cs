using System;
using System.Collections.Generic;

namespace fruitfullServer.Models;

public partial class Report
{
    public int ReportId { get; set; }

    public int UserId { get; set; }

    public int? PostId { get; set; }

    public int? CommentId { get; set; }

    public string Reason { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }  //it set not to nullable in the DB and applies GETDATE()

    public virtual Comment? Comment { get; set; }

    public virtual Post? Post { get; set; }

    public virtual User User { get; set; } = null!;
}
