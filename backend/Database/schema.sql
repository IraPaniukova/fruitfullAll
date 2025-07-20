CREATE DATABASE FruitfullDB;
GO

USE FruitfullDB;
GO

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) ,
    Country VARCHAR(100),
    Theme VARCHAR(10) DEFAULT 'light' CHECK (Theme IN ('light', 'dark')),
    Nickname VARCHAR(100) NULL,
    ProfileImage VARCHAR(255) NULL,
    AuthProvider VARCHAR(20) DEFAULT 'local',
    GoogleId VARCHAR(255) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE
);

	-- (bridging table)    UserId is FK to Users.UserId,   RoleId is FK to Roles.RoleId
CREATE TABLE UserRoles (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

CREATE TABLE AuthTokens
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    RefreshToken NVARCHAR(200) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    RevokedAt DATETIME2 NULL,
    CONSTRAINT FK_AuthTokens_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

	-- UserId is FK to Users.UserId
CREATE TABLE Posts (
    PostId INT IDENTITY(1,1) PRIMARY KEY,
    Content TEXT NOT NULL,
    Opinion  TEXT NULL,
    Company VARCHAR(100) NOT NULL,
    Industry VARCHAR(100) NOT NULL,
    Year INT NOT NULL,
    Country VARCHAR(100) NOT NULL,
    StressLevel INT NOT NULL CHECK (StressLevel BETWEEN 0 AND 5),
    QuestionType VARCHAR(100) NOT NULL,
    InterviewFormat VARCHAR(100) NOT NULL,
    UserId INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    LikesCount INT DEFAULT 0,
    CONSTRAINT FK_Posts_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

	-- PostId is FK to Posts.PostId,	UserId is FK to Users.UserId
CREATE TABLE Comments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    PostId INT NOT NULL,
    UserId INT NOT NULL,
    Text TEXT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
    UpdatedAt DATETIME NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    LikesCount INT DEFAULT 0,
    CONSTRAINT FK_Comments_Posts FOREIGN KEY (PostId) REFERENCES Posts(PostId),
    CONSTRAINT FK_Comments_Users_User FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

	-- (bridging table)    PostId is FK to Posts.PostId,   UserId is FK to Users.UserId
CREATE TABLE PostLikes (
    UserId INT NOT NULL,
    PostId INT NOT NULL,
    PRIMARY KEY (UserId, PostId),
    CONSTRAINT FK_PostLikes_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_PostLikes_Posts FOREIGN KEY (PostId) REFERENCES Posts(PostId)
);

	--  (bridging table)   UserId is FK to Users.UserId,    CommentId is FK to Comments.CommentId
CREATE TABLE CommentLikes (
    UserId INT NOT NULL,
    CommentId INT NOT NULL,
    PRIMARY KEY (UserId, CommentId),
    CONSTRAINT FK_CommentLikes_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_CommentLikes_Comments FOREIGN KEY (CommentId) REFERENCES Comments(CommentId)
);


CREATE TABLE Tags (
    TagId INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE
);

	-- (bridging table)    PostId is FK to Posts.PostId,   TagId is FK to Tags.TagId 
CREATE TABLE PostTags (
    PostId INT NOT NULL,
    TagId INT NOT NULL,
    PRIMARY KEY (PostId, TagId),
    CONSTRAINT FK_PostTags_Posts FOREIGN KEY (PostId) REFERENCES Posts(PostId),
    CONSTRAINT FK_PostTags_Tags FOREIGN KEY (TagId) REFERENCES Tags(TagId)
);

	-- UserId is FK to Users.UserId,  PostId is FK to Posts.PostId,  CommentId is FK to Comments.CommentId
CREATE TABLE Reports (
    ReportId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    PostId INT NULL,
    CommentId INT NULL,
    Reason VARCHAR(500) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Reports_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_Reports_Posts FOREIGN KEY (PostId) REFERENCES Posts(PostId),
    CONSTRAINT FK_Reports_Comments FOREIGN KEY (CommentId) REFERENCES Comments(CommentId)
);