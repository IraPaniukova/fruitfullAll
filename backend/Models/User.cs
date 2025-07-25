﻿using System;
using System.Collections.Generic;

namespace fruitfullServer.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public string? Country { get; set; } 

    public string? Theme { get; set; } 

    public string? Nickname { get; set; }

    public string? ProfileImage { get; set; }

    public string? AuthProvider { get; set; }

    public string? GoogleId { get; set; }

    public DateTime? CreatedAt { get; set; } //it set not to nullable in the DB and applies GETDATE()

    public virtual ICollection<AuthToken> AuthTokens { get; set; } = new List<AuthToken>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual ICollection<Comment> CommentsNavigation { get; set; } = new List<Comment>();

    public virtual ICollection<Post> PostsNavigation { get; set; } = new List<Post>();

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}